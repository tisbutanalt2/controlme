import { clipboard, dialog, ipcMain, shell } from 'electron';
import context from 'ctx';

import log from 'log';
import sanitizeError from '@utils/sanitizeError';

import './config';
import './share';
import './auth';
import './server';
import './ngrok';
import './notification';
import './popup';
import './functions';

ipcMain.handle('version', () => context.version);
ipcMain.on('error', (e, err: unknown, moduleName?: string) => {
    log(`Error in browser window ${e.sender.getTitle()}${moduleName ? ` (${moduleName} module)` : ''}: ${sanitizeError(String(err))}`)
});

ipcMain.on('clipboard.write', (_e, str: string) => {
    clipboard.writeText(str);
});

ipcMain.handle('folder.select', async (_e) => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (result.canceled) return;

    const path = result.filePaths[0];
    const nameMatch = path.match(/\/|\\([^\/\\]+)$/);

    return {
        path: result.filePaths[0],
        name: nameMatch?.[1] || 'New Folder'
    }
});

ipcMain.on('folder.open', (_e, path: string) => {
    shell.openPath(path);
})

ipcMain.on('folder.openDefaultFiles', () => {
    shell.openPath(context.defaultFileFolder);
});

ipcMain.on('folder.openDefaultMedia', () => {
    shell.openPath(context.defaultMediaFolder);
});