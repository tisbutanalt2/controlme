import { Router } from 'express';
import context from 'ctx';
import authStore from '@stores/auth';

import getShareLink from '@utils/server/getShareLink';

import { randomUUID } from 'crypto';
import jsonwebtoken from 'jsonwebtoken';

import { ShareLinkType, UserType } from 'enum';
import { jwtExpirationTime } from 'const';

const shareMiddleware = Router();

shareMiddleware.use('/', (req, res, next) => {
    const sid = req.query.sid as string|undefined;
    if (!sid) return next();

    const shareLink = getShareLink(sid);
    if (typeof shareLink === 'string')
        return res.status(400).send(shareLink);

    switch(shareLink.type) {
        case ShareLinkType.Discord:
            return res.redirect(`/auth/discord?sid=${sid}`) // TODO change this

        case ShareLinkType.Access:
            let k = `Anon_${randomUUID()}`;
            while (!authStore.has(`users.${k}`)) {
                k = `Anon_${randomUUID()}`;
            }

            const ts = Math.floor(Date.now() / 1000);
            const jwt = jsonwebtoken.sign({
                t: UserType.Access,
                iat: ts,
                exp: ts + jwtExpirationTime,
                dn: 'Anonymous',
                k,
                sid
            } as Auth.JWT, context.secret);

            getShareLink(sid, true);
            
            res.cookie('jwt', jwt, { httpOnly: true });
            return res.redirect('/');
    }

    req.shareLink = shareLink;
    next();
});

export default shareMiddleware;