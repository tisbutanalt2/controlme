import { Router, static as expressStatic } from 'express';
import { join, resolve } from 'path';

import context from 'ctx';
import authStore from '@stores/auth';

const webPath = join(__dirname, '..', 'web');
const web = Router();

web.get('/', (req, res) => {
    // Sign jwt for sharelink here?
    const shareId = req.query.sid as string|undefined;
    if (req.query.sid) {
        
    }

    res.sendFile(
        join(webPath, 'index.html')
    );
});

web.get('/favicon.ico', (_req, res) => {
    res.sendFile(
        resolve(context.appIconPath)
    );
});

web.use(expressStatic(webPath));


export default web;