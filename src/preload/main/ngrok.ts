import { ipcRenderer } from 'electron';

const ngrokFunctions = {
    startNgrok: () => ipcRenderer.invoke('startNgrok'),
    stopNgrok: () => ipcRenderer.invoke('stopNgrok'),

    ngrokUrl: () => ipcRenderer.invoke('ngrokUrl') as Promise<string|undefined>,
    
    ngrokStatus: () => ipcRenderer.invoke('ngrokStatus') as Promise<ControlMe.NgrokStatus>,
    ngrokError: () => ipcRenderer.invoke('ngrokError') as Promise<string|null>
};

export default ngrokFunctions;