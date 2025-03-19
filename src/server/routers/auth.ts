import { Router } from 'express';
import { randomUUID } from 'crypto';

import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

import context from 'ctx';
import configStore from '@stores/config';
import authStore from '@stores/auth';

import axios from 'axios';

import getShareLink from '@utils/server/getShareLink';
import getFunctionAccess from '@utils/server/getFunctionAccess';
import validateSignup from '@utils/validateSignup';

import requireLoggedIn from '@utils/server/requireLoggedIn';
import minifyUser from '@utils/minifyUser';

import { UserType } from 'enum';
import { jwtExpirationTime, maxDisplayNameLength } from 'const';

const login = (
    username: string,
    password: string,
    user?: Auth.User,
    returnUser: boolean = false
) => {
    user ??= authStore.get(`users.${username}`) as Auth.User;
    if (!user || user.type !== UserType.Login) return false;

    const success = bcrypt.compareSync(password, user.password);
    if (!success) return false;

    const timestamp = Math.floor(Date.now() / 1000);
    user.lastLogin = timestamp;

    authStore.set(`users.${username}`, user);

    const jwt = jsonwebtoken.sign({
        t: UserType.Login,
        usr: username,
        iat: timestamp,
        exp: timestamp + jwtExpirationTime
    } as Auth.JWT, context.secret);

    return returnUser ? [jwt, user] : jwt;
}

const authRouter = Router();

authRouter.post('/auth/signup', (req, res) => {
    const sid = req.query.sid as string|undefined;
    if (typeof sid !== 'string')
        throw 'Missing signup ID';

    const username = (req.body.username as string|undefined)?.toLowerCase?.();
    const password = req.body.password as string|undefined;

    if (typeof username !== 'string' || typeof password !== 'string')
        throw 'Missing username and/or password';

    if (authStore.has(`users.${username}`))
        throw 'User already exists';

    const shareLink = getShareLink(sid);
    if (typeof shareLink === 'string')
        throw shareLink;

    const validateRes = validateSignup(username, password);
    if (validateRes !== true) throw (validateRes.username || validateRes.password);

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    const displayName = String(req.body.displayName);
    if (displayName.length > maxDisplayNameLength)
        throw `Display name cannot be longer than ${maxDisplayNameLength} characters`;

    const user: Auth.User = {
        type: UserType.Login,
        _key: username,
        username,
        password: hashedPassword,
        displayName: String(req.body.username) || username,
        functionOverrides: shareLink.functionOverrides
    };

    const jwt = login(username, password, user);
    if (!jwt) throw 'Failed to log in';

    res.cookie('jwt', jwt, { httpOnly: true });
    res.json(minifyUser(user));

    getShareLink(sid, true);
});

authRouter.post('/auth/login', (req, res) => {
    const username = req.body.username as string|undefined;
    const password = req.body.password as string|undefined;

    if (typeof username !== 'string' || typeof password !== 'string')
        throw 'Missing username and/or password';

    const pair = login(
        username,
        password,
        undefined,
        true
    ) as [string, Auth.User]|false;

    if (!pair) throw 'Incorrect username and/or password';
    const [jwt, user] = pair;

    res.cookie('jwt', jwt, { httpOnly: true });
    res.json(minifyUser(user));
});

authRouter.post('/auth/logout', requireLoggedIn(false, true), (req, res) => {
    res.clearCookie('jwt', { httpOnly: true });

    if (
        req.user.type === UserType.Login ||
        req.user.type === UserType.Discord
    ) authStore.set(
        `users.${req.user._key}.lastLogout` as keyof Auth.Store,
        Math.floor(Date.now() / 1000)
    );

    res.send('Ok');
});

authRouter.delete('/auth/delete', requireLoggedIn(false), (req, res) => {
    const user = req.user as Auth.User & { type: UserType.Login|UserType.Discord };

    authStore.delete(`users.${user._key}` as keyof Auth.Store);
    res.clearCookie('jwt', { httpOnly: true });

    res.send('Ok');
});

export default authRouter;