import { ipcMain } from 'electron';
import context from '@main/context';

import './config';
import './server';
import './ngrok';

ipcMain.handle('version', () => context.version);
ipcMain.on('error', (e, err: any) => {
    console.error(`Error in browser window ${e.sender.getTitle()}`);
    console.error(err);
});