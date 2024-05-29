import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const context = {
    on: (event: string, cb: Listener) => {
        const listener = (e: IpcRendererEvent, ...args: any[]) => {
            console.log(e);
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

    // Config functions
    getConfig: () => ipcRenderer.invoke('getConfig'),
    
    getConfigValue: (key: string) => ipcRenderer.invoke('getConfigValue', key),
    setConfigValue: (key: string, value: any) => ipcRenderer.invoke('setConfigValue', key, value),

    onConfigValueChange: (key: string, cb: Listener) => {
        // Subscribe to the event
        ipcRenderer.send('onConfigValueChange', key);

        const listener = (e: IpcRendererEvent, k: string, value: any) => {
            (k === key) && cb(value);
        }

        ipcRenderer.on('configValueChange', listener);
        return () => {
            ipcRenderer.off('configValueChange', listener);
        };
    },

    // Server functions
    startServer: () => ipcRenderer.invoke('startServer'),
    stopServer: () => ipcRenderer.invoke('stopServer'),
    restartServer: () => ipcRenderer.invoke('restartServer'),

    getServerStatus: () => ipcRenderer.invoke('getServerStatus'),

    startNgrok: () => ipcRenderer.invoke('startNgrok'),
    stopNgrok: () => ipcRenderer.invoke('stopNgrok'),

    getNgrokStatus: () => ipcRenderer.invoke('getNgrokStatus'),
    getNgrokURL: () => ipcRenderer.invoke('getNgrokURL'),
    getNgrokError: () => ipcRenderer.invoke('getNgrokError'),

    getVersion: () => ipcRenderer.invoke('getVersion'),

    // Share link functions
    generateShareLink: (options: Omit<Auth.ShareLink, 'id'>) =>
        ipcRenderer.invoke('generateShareLink', options),

    deleteShareLink: (id: string) =>
        ipcRenderer.invoke('deleteShareLink', id),

    getShareLinks: () => ipcRenderer.invoke('getShareLinks'), 

    writeToClipboard: (str: string) =>
        ipcRenderer.invoke('writeToClipboard', str),

    openFileFolder: () => ipcRenderer.invoke('openFileFolder')
}

declare global {
    interface Window {
        ipc: typeof context;
    }
}

contextBridge.exposeInMainWorld('ipc', context);
export {};