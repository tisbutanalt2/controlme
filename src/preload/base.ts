import { ipcRenderer, contextBridge } from 'electron';

const baseContext = {
    getConfigValue: <T = any>(k: string) => ipcRenderer.invoke('config.get', k) as Promise<T>,

    on: (channel: string, cb: Listener) => {
        const listener = (_e, ...args: Array<unknown>) =>
            cb(...args);

        ipcRenderer.on(channel, listener);
        return () => ipcRenderer.off(channel, listener);
    },

    once: (channel: string, cb: Listener) => {
        ipcRenderer.once(channel, (_e, ...args: Array<unknown>) =>
            cb(...args)
        );
    },

    version: () => ipcRenderer.invoke('version') as Promise<string>,
    sendError: (err: unknown, moduleName?: string) => ipcRenderer.send('error', err, moduleName),

    writeToClipboard: (str: string) => ipcRenderer.send('clipboard.write', str)
};

declare global {
    interface Window {
        ipcShared: typeof baseContext;
    }
}

contextBridge.exposeInMainWorld('ipcShared', baseContext);
export default baseContext;