import { ipcRenderer } from 'electron';

const configFunctions = {
    getConfigValue: <T = any>(k: string) => ipcRenderer.invoke('config.get', k) as Promise<T>,
    setConfigValue: (k: string, v: any) => ipcRenderer.invoke('config.set', k, v),

    getConfig: () => ipcRenderer.invoke('config.get') as Promise<ControlMe.Settings>,

    onConfigValueChange: <T = any>(k: string, cb: Listener) => {
        ipcRenderer.send('config.subscribeToChange', k);

        const listener = (e: Electron.IpcRendererEvent, changedKey: string, newValue: T) => {
            (changedKey === k) && cb(newValue);
        }

        ipcRenderer.on('config.valueChange', listener);
        return () => ipcRenderer.off('config.valueChange', listener);
    }
};

export default configFunctions;