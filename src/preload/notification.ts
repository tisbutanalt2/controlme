import { contextBridge, ipcRenderer } from 'electron';
import baseContext from '@preload/base';

const context = {
    ...baseContext,

    onNotification: (handler: (notif: ControlMe.Notification) => void) => {
        const listener = (_e, notif: ControlMe.Notification) => {
            handler(notif);
        };

        ipcRenderer.on('notification', listener);
        return () => ipcRenderer.off('notification', listener);
    },
    notificationResult: (id: string, v: boolean|null) => ipcRenderer.send('notification.result', id, v),
    ready: () => ipcRenderer.send('notification.ready')
};

declare global {
    interface Window {
        ipcNotification: typeof context;
    }
}

contextBridge.exposeInMainWorld('ipcNotification', context);
export {};