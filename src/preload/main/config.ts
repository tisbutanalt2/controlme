import { ipcRenderer } from 'electron';

const configFunctions = {
    setConfigValue: (k: string, v: any) => ipcRenderer.send('config.set', k, v),
    deleteConfigValue: (k: string) => ipcRenderer.send('config.delete'),

    getConfig: () => ipcRenderer.invoke('config.get') as Promise<ControlMe.Settings>,
    purgeUsers: () => ipcRenderer.invoke('auth.purgeUsers'),
    deleteUsers: () => ipcRenderer.invoke('auth.deleteUsers'),

    onConfigValueChange: <T = unknown>(k: string, cb: Listener) => {
        ipcRenderer.send('config.subscribeToChange', k);

        const listener = (_e, changedKey: string, newValue: T) => {
            (changedKey === k) && cb(newValue);
        }

        ipcRenderer.on('config.valueChange', listener);
        return () => ipcRenderer.off('config.valueChange', listener);
    },

    getFunctions: () => ipcRenderer.invoke('functions.get') as Promise<Array<ControlMe.ReducedFunction>>,

    selectFolder: () => ipcRenderer.invoke('folder.select') as Promise<{ path: string; name: string }|undefined>,
    openFolder: (path: string) => ipcRenderer.send('folder.open', path),
    
    openFileFolder: () => ipcRenderer.send('folder.openDefaultFiles'),
    openMediaFolder: () => ipcRenderer.send('folder.openDefaultMedia')
};

export default configFunctions;