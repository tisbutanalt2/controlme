import { contextBridge, ipcRenderer } from 'electron';
import baseContext from '@preload/base';

const context = {
    ...baseContext,

    focus: () => ipcRenderer.send('popupFocus'),
    blur: () => ipcRenderer.send('popupBlur')
};

declare global {
    interface Window {
        ipcPopup: typeof context;
    }
}

contextBridge.exposeInMainWorld('ipcPopup', context);
export {};