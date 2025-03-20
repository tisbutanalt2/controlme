import { Router } from 'express';
import context from 'ctx';

import configStore from '@stores/config';
import authStore from '@stores/auth';

import axios from 'axios';
import { UserType } from 'enum';

import { httpRegex } from '@utils/regex';
import getShareLink from '@utils/server/getShareLink';

import log from 'log';
import unixTimestamp from '@utils/unixTimestamp';
import { jwtExpirationTime } from 'const';

import jsonwebtoken from 'jsonwebtoken';

const discordRouter = Router();

discordRouter.get('/auth/discord', (req, res) => {
    if (!req.shareLink) throw 'Share link is missing';

    const applicationId = configStore.get('discord.applicationId') as string|undefined;
    const applicationSecret = configStore.get('discord.applicationSecret') as string|undefined;

    const appAddress = context.ngrok?.url || configStore.get('server.address');
    let tps = configStore.get(`security.thirdPartyServer`) as string|undefined;

    if (
        configStore.get(`discord.useCustomApplication`) &&
        applicationId &&
        applicationSecret &&
        appAddress &&
        !/^(https?:\/\/)?localhost:?/.test(appAddress)
    ) {
        const url = new URL(`https://discord.com/oauth2/authorize`);
        
        url.searchParams.set('client_id', applicationId);
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('redirect_uri', `${appAddress}/auth/callback/discord`);
        url.searchParams.set('scope', 'identify');

        url.searchParams.set('state', req.shareLink.id);
        return res.redirect(url.href);
    }

    else if (appAddress && tps) {
        if (!httpRegex.test(tps))
            tps = `https://${tps}`;

        return res.redirect(
            `${tps}${tps.endsWith('/') ? '' : '/'}auth/discord?addr=${
                appAddress
            }&sid=${req.shareLink.id}`
        );
    }

    throw 'Discord auth is not available';
});

discordRouter.get('/auth/callback/discord', async (req, res) => {
    const sid = req.query.state as string|undefined;
    if (!sid) throw 'Share link is missing';

    const shareLink = getShareLink(sid);
    if (typeof shareLink === 'string') throw shareLink;

    const code = req.query.code as string|undefined;
    if (!code) throw 'Code missing';

    const appAddress = context.ngrok?.url || configStore.get('server.address');
    if (!appAddress) throw 'App address missing';

    const applicationId = configStore.get('discord.applicationId') as string|undefined;
    const applicationSecret = configStore.get('discord.applicationSecret') as string|undefined;
    if (!applicationId || !applicationSecret) throw 'Discord settings are missing';

    const params = new URLSearchParams();

    params.append('client_id', applicationId);
    params.append('client_secret', applicationSecret);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', `${appAddress}${appAddress.endsWith('/') ? '' : '/'}auth/callback/discord`);

    try {
        const tokenRes = await axios.post(`https://discord.com/api/oauth2/token`, params);
        const { access_token, token_type } = tokenRes.data as Record<string, string>;

        const userDataRes = await axios.get(`https://discord.com/api/users/@me`, {
            headers: {
                Authorization: `${token_type} ${access_token}`
            }
        });

        const ts = unixTimestamp();

        const user = userDataRes.data as Auth.DiscordUser;
        const parsedUser: Auth.User = {
            type: UserType.Discord,
            _key: user.id,
            userId: user.id,
            username: user.username,
            displayName: user.global_name,
            avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
            functionOverrides: shareLink.functionOverrides,
            lastLogin: ts
        };

        authStore.set(`users.${user.id}`, parsedUser);
        const jwt: Auth.JWT = {
            t: UserType.Discord,
            iat: ts,
            exp: ts + jwtExpirationTime,
            id: user.id
        };

        res.cookie('jwt', jsonwebtoken.sign(jwt, context.secret));
        res.redirect('/');
    } catch(err) {
        log(`Failed to authenticate discord user: ${err?.message || err}`, 'error');
        return res.status(400).send('Failed to authenticate');
    }
});

// Third party server callback
discordRouter.get('/auth/callback/discord/tps', (req, res) => {

});

export default discordRouter;