import { contextBridge, ipcRenderer } from 'electron';
import baseContext from '@preload/base';

const context = {
    ...baseContext,

    focus: () => ipcRenderer.send('notificationFocus'),
    blur: () => ipcRenderer.send('notificationBlur'),
    notificationResult: (v: boolean|null) => ipcRenderer.send('notificationResult', v)
};

declare global {
    interface Window {
        ipcNotification: typeof context;
    }
}

contextBridge.exposeInMainWorld('ipcNotification', context);
export {};