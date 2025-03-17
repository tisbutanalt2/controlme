import { ipcMain } from 'electron';
import { randomUUID } from 'crypto';
import { pathToFileURL } from 'url';

import context from 'ctx';
import waitForSeconds from '@utils/promise/waitForSeconds';

let notificationReady = false;

const notifPromises = new Map<string, (v?: boolean) => void>();
export const displayNotification = async (notif: Omit<ControlMe.Notification, 'id'> & { id?: string }, useAppIcon: boolean = false) => {
    notif.id ??= randomUUID();
    
    if (useAppIcon) {
        notif.imageSrc = pathToFileURL(context.appIconPath).pathname;
        notif.imageWidth = 64;
        notif.imageHeight = 64;
    }
    
    for (let i = 0; i < 10; i++) {
        if (!notificationReady) await waitForSeconds(0.5);
    }

    if (!context.modules.notification) return;
    context.modules.notification?.webContents.send('notification', notif);

    return new Promise<boolean|undefined>(res => {
        notifPromises.set(notif.id, res);

        notif.timeout && setTimeout(() => {
            if (!notifPromises.has(notif.id)) return;

            notifPromises.delete(notif.id);
            res(undefined);
        }, notif.timeout);
    });
}

ipcMain.on('notification.ready', () => {
    notificationReady = true;
});

ipcMain.on('notification.result', (_e, id: string, v?: boolean) => {
    const resolve = notifPromises.get(id);
    if (!resolve) return;

    resolve(v);
    notifPromises.delete(id);
});