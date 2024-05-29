import { Router, static as expressStatic } from 'express';
import { join } from 'path';

import configStore from '@utils/store/config';
import authStore from '@utils/store/auth';

import getFunctionAccess from '@utils/server/getFunctionAccess';

const web = Router();

web.get('/title', (req, res) => {
    res.send(configStore.get('appearance.title') || null);
});

web.get('/sharelink', (req, res) => {
    const shareId = req.query.sid as string;
    if (!shareId) return res.status(400).send('This app requires a share ID in the link');

    const shareLink: Auth.ShareLink = authStore.get(`shareLinks.${shareId}`);
    if (!shareLink) return res.status(404).send('Sharelink not found');

    const expired = shareLink.expiresAt
        ? new Date(shareLink.expiresAt).valueOf() < Date.now()
        : false;

    if (expired) {
        authStore.delete(`shareLinks.${shareId}` as keyof Auth.AuthStore);
        res.status(400).send('This link has expired');
    }

    const currentUses = shareLink.currentUses ?? 0;
    const maxUses = shareLink.maxUses ?? 0;

    if (
        maxUses !== 0 &&
        currentUses >= maxUses
    ) return res.status(400).send('This link has already been used the max amount of times');

    // TODO usage should be incremented upon socket connection, already done for login

    res.json({
        id: shareLink.id,
        type: shareLink.type,
        functions: getFunctionAccess(shareLink.accessOverrides)
    });
});

// Serve web app
web.get('/', (req, res) => {
    res.sendFile(join(__dirname, '..', 'web', 'index.html'));
});

// Serve web assets (mainly fonts)
web.use(expressStatic(join(__dirname, '..', 'web')));
export default web;