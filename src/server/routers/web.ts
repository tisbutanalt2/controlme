import { Router, static as expressStatic } from 'express';
import { join } from 'path';

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

web.use(expressStatic(webPath));


export default web;