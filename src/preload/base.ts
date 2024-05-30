import { ipcRenderer } from 'electron';

const baseContext = {
    on: (channel: string, cb: Listener) => {
        const listener = (e: Electron.IpcRendererEvent, ...args: any[]) =>
            cb(...args);

        ipcRenderer.on(channel, listener);
        return () => ipcRenderer.off(channel, listener);
    },

    once: (channel: string, cb: Listener) => {
        ipcRenderer.once(channel, (e, ...args: any[]) =>
            cb(...args)
        );
    },

    version: () => ipcRenderer.invoke('version'),
    sendError: (err: any) => ipcRenderer.send('error', err)
}

export default baseContext;