import { clipboard, ipcMain } from 'electron';
import context from '@main/context';

import './config';
import './server';
import './ngrok';
import './share';

ipcMain.handle('version', () => context.version);
ipcMain.on('error', (e, err: any) => {
    console.error(`Error in browser window ${e.sender.getTitle()}`);
    console.error(err);
});

ipcMain.on('writeToClipboard', (a, str: string) => {
    clipboard.writeText(str);
})