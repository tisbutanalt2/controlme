import { ipcRenderer } from 'electron';

const ngrokFunctions = {
    startNgrok: () => ipcRenderer.invoke('startNgrok'),
    stopNgrok: () => ipcRenderer.invoke('stopNgrok'),

    ngrokStatus: () => ipcRenderer.invoke('ngrokStatus'),
    ngrokError: () => ipcRenderer.invoke('ngrokError')
};

export default ngrokFunctions;