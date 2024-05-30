import { ipcRenderer } from 'electron';

const serverFunctions = {
    startServer: () => ipcRenderer.invoke('startServer'),
    stopServer: () => ipcRenderer.invoke('stopServer'),
    restartServer: () => ipcRenderer.invoke('restartServer'),

    serverStatus: () => ipcRenderer.invoke('serverStatus'),
    serverError: () => ipcRenderer.invoke('serverError')
};

export default serverFunctions;