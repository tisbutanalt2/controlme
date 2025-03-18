import { ipcMain, clipboard } from 'electron';
import { displayNotification } from './notification';

import context from 'ctx';
import authStore from '@stores/auth';
import configStore from '@stores/config';

import { randomUUID } from 'crypto';

ipcMain.handle('share.generate', (_e, props: Omit<Auth.ShareLink, 'id'>) => {
    const id = randomUUID();
    const link: Auth.ShareLink = {
        id,
        ...props
    };

    authStore.set(`shareLinks.${id}` as keyof Auth.Store, link);
    context.mainWindow?.webContents.send('share.added', link);

    let url = context.ngrok?.url ?? configStore.get(`server.address`);
    if (url) {
        // Append http if necessary
        if (!/^https?:\/\//.test(url)) url = `http://${url}`;
        clipboard.writeText(`${url}?sid=${link.id}`);

        displayNotification({
            title: 'Sharelink generated!',
            message: 'The link was copied to your clipboard'
        }, true);
    }

    return link;
});

ipcMain.handle('share.get', () => {
    const links = authStore.get('shareLinks');
    if (!links) return [];

    return Object.values(links);
});

ipcMain.on('share.delete', (_e, id: string) => {
    authStore.delete(`shareLinks.${id}` as keyof Auth.Store);
    context.mainWindow?.webContents.send('share.deleted', id);
});