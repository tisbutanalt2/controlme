import { ipcRenderer } from 'electron';

const serverFunctions = {
    startServer: () => ipcRenderer.invoke('server.start'),
    stopServer: () => ipcRenderer.invoke('server.stop'),
    restartServer: () => ipcRenderer.invoke('server.restart'),

    serverStatus: () => ipcRenderer.invoke('server.status') as Promise<ControlMe.Statuses['server']>,
    serverError: () => ipcRenderer.invoke('server.error') as Promise<string|undefined>
};

export default serverFunctions;