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

        // TEMP FOR BYPASS
        popupIpc: typeof context;
    }
}

contextBridge.exposeInMainWorld('ipcPopup', context);
export {};