import { Router } from 'express';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import authStore, { secret } from '@utils/store/auth';
import requireLoggedIn from '@utils/server/requireLoggedIn';
import getFunctionAccess from '@utils/server/getFunctionAccess';

const login = (username: string, password: string, user?: Auth.User) => {
    user ??= authStore.get(`users.${username}`);
    if (!user) return false;

    const success = bcrypt.compareSync(password, user.password);
    if (!success) return false;

    const timestamp = Date.now();

    authStore.set(`users.${username}`, {
        ...user,
        lastLogin: timestamp
    } as Auth.User);

    return jwt.sign({
        username,
        timestamp
    } as Auth.JWT, secret);
}

const auth = Router();

auth.post('/auth/signup', (req, res) => {
    const id = req.query.sid as string;
    if (typeof id !== 'string')
        return res.status(400).send('Missing signup ID');

    const shareLink = authStore.get(`shareLinks.${id}`) as Auth.ShareLink;
    if (shareLink?.type !== 'signup')
        return res.status(400).send('Invalid link');

    const expired = shareLink.expiresAt
        ? new Date(shareLink.expiresAt).valueOf() < Date.now()
        : false;

    if (expired) {
        authStore.delete(`shareLinks.${id}` as keyof Auth.AuthStore);
        res.status(400).send('This link has expired');
    }

    const currentUses = shareLink.currentUses ?? 0;
    const maxUses = shareLink.maxUses ?? 0;

    if (
        maxUses !== 0 &&
        currentUses >= maxUses
    ) return res.status(400).send('This link has already been used the max amount of times');

    const username = (req.body.username as string)?.toLowerCase?.();
    const password = req.body.password as string;

    if (typeof username !== 'string' || typeof password !== 'string')
        return res.status(400).send('Missing username and/or password');

    if (authStore.has(`users.${username}`))
        return res.status(400).send('User already exists');

    // Username must be minimum 3 chars and only include a-z, 0-9 and underscore
    if (!/^[a-z0-9_]{3,}$/.test(username))
        return res.status(400).send('Bad username');

    // Password must be >= 5 in length without spaces
    if (!/^[^\s]{5,}$/.test(password))
        return res.status(400).send('Bad password');

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user: Auth.User = {
        username,
        password: hashedPassword,

        displayName: String(req.body.displayName) || username
    }

    authStore.set(`users.${username}`, user);
    authStore.set(`shareLinks.${id}.currentUses`, currentUses + 1);

    res.status(200).json({
        jwt: login(username, password, user),
        functions: getFunctionAccess(shareLink.accessOverrides)
    });
});

auth.post('/auth/login', (req, res) => {
    const username = (req.body.username as string)?.toLowerCase?.();
    const password = req.body.password as string;

    if (typeof username !== 'string' || typeof password !== 'string')
        return res.status(400).send('Missing username and/or password');

    const result = login(username, password);

    result
        ?res.send(result)
        :res.status(400).send('Incorrect login');
});

auth.post('/auth/logout', requireLoggedIn(), (req, res) => {
    const user = req.user;

    authStore.set(`users.${user.username}`, {
        ...user,
        lastLogout: Date.now()
    } as Auth.User);

    res.status(200).send('Ok');
});

auth.get('/auth/access', requireLoggedIn(), (req, res) => {
    res.json({
        user: {
            username: req.user.username,
            displayName: req.user.displayName
        },

        displayName: req.user.displayName,
        functions: getFunctionAccess(req.user.accessOverrides)
    } as ControlMe.Web.AccessSetup);
});

auth.delete('/auth/delete', requireLoggedIn(), (req, res) => {
    authStore.delete(`users.${req.user.username}` as keyof Auth.AuthStore);
    res.status(200).send('Ok');
});

export default auth;