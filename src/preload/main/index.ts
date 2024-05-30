import { contextBridge } from 'electron';
import baseContext from '@preload/base';

import serverFunctions from './server';
import ngrokFunctions from './ngrok';

const context = {
    ...baseContext,
    ...serverFunctions,
    ...ngrokFunctions
};

declare global {
    interface Window {
        ipcMain: typeof context;

        // TEMP FOR BYPASS
        ipc: typeof context;
    }
}

contextBridge.exposeInMainWorld('ipcMain', context);
export {};