import { ipcMain } from 'electron';
import authStore from '@utils/store/auth';

import { randomUUID } from 'crypto';

ipcMain.handle('shareLink.generate', (e, options: Omit<Auth.ShareLink, 'id'>) => {
    const id = randomUUID();
    
    const link: Auth.ShareLink = {
        id,
        ...options
    };

    authStore.set(`shareLinks.${id}`, link);
    e.sender.send('shareLink.added', link);

    return id;
});

ipcMain.handle('shareLink.modify', (e, id: string, options: Partial<Auth.ShareLink>) => {
    const link = authStore.get(`shareLinks.${id}`) as Auth.ShareLink;
    if (!link) return;

    authStore.set(`shareLinks.${id}`, {
        ...link,
        ...options
    });
});

ipcMain.handle('shareLink.delete', (e, id: string) => {
    authStore.delete(`shareLinks.${id}` as keyof Auth.AuthStore);
    e.sender.send('shareLink.deleted', id);
});

ipcMain.handle('shareLink.getAll', () => {
    return Object.values(authStore.get('shareLinks') ?? {});
});