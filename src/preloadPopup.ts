import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const context = {
    on: (event: string, cb: Listener) => {
        const listener = (e: IpcRendererEvent, ...args: any[]) => {
            cb(...args);
        }
        
        ipcRenderer.on(event, listener);
        return () => ipcRenderer.off(event, listener);
    },

    once: (event: string, cb: Listener) => {
        ipcRenderer.once(event, (e, ...args: any[]) => {
            cb(...args);
        });
    },

    focus: () => ipcRenderer.send('popupFocus'),
    blur: () => ipcRenderer.send('popupBlur'),

    sendError: (err: any) => ipcRenderer.send('error', err)
}

declare global {
    interface Window {
        popupIpc: typeof context;
    }
}

contextBridge.exposeInMainWorld('popupIpc', context);
export {};