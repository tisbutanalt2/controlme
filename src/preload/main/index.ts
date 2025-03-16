import { contextBridge } from 'electron';

import baseContext from '@preload/base';
import configFunctions from './config';

import serverFunctions from './server';
import ngrokFunctions from './ngrok';

import shareFunctions from './share';

const context = {
    ...baseContext,
    ...configFunctions,

    ...serverFunctions,
    ...ngrokFunctions,

    ...shareFunctions
};

declare global {
    interface Window {
        ipcMain: typeof context;
    }
}

contextBridge.exposeInMainWorld('ipcMain', context);
contextBridge.exposeInMainWorld('ipc', context);

export {};