import { Router, static as expressStatic } from 'express';

import { readFileSync } from 'fs';
import { join, resolve } from 'path';

import context from 'ctx';
import configStore from '@stores/config';

import { ShareLinkType, UserType } from 'enum';
import minifyUser from '@utils/minifyUser';

const webPath = join(__dirname, '..', 'web');
const web = Router();

const indexPath = join(webPath, 'index.html');
web.get('/', (req, res) => {
    if (configStore.get('security.disableAuth')) return res.sendFile(indexPath);

    let data: ControlMe.MinifiedWebData|undefined;

    if (req.shareLink?.type === ShareLinkType.Signup)
        data = {
            su: true,
            sid: req.shareLink.id
        };

    else if (req.user) {
        data = {
            u: minifyUser(req.user)
        };
    }

    let indexContent = readFileSync(indexPath, 'utf-8');

    const title = configStore.get('appearance.title') as string|undefined;
    if (title) indexContent = indexContent
        .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
        
    if (data)
        indexContent = indexContent
            .replace(/(<body[^>]*>)/, `$1<script type="application/json" id="controlme-data">${JSON.stringify(data)}</script>`);
    
    res.send(indexContent);

});

web.get('/favicon.ico', (_req, res) => {
    res.sendFile(
        resolve(context.appIconPath)
    );
});

web.use(expressStatic(webPath));


export default web;