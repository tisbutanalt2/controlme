import { ipcRenderer } from 'electron';

const ngrokFunctions = {
    startNgrok: () => ipcRenderer.invoke('ngrok.start'),
    stopNgrok: () => ipcRenderer.invoke('ngrok.stop'),

    ngrokUrl: () => ipcRenderer.invoke('ngrok.url') as Promise<string|undefined>,
    
    ngrokStatus: () => ipcRenderer.invoke('ngrok.status') as Promise<ControlMe.Statuses['ngrok']>,
    ngrokError: () => ipcRenderer.invoke('ngrok.error') as Promise<string|undefined>
};

export default ngrokFunctions;