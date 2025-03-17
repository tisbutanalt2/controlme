import { clipboard, ipcMain } from 'electron';
import context from 'ctx';

import log from 'log';
import sanitizeError from '@utils/sanitizeError';

import './config';
import './auth';
import './server';
import './ngrok';
import './notification';

ipcMain.handle('version', () => context.version);
ipcMain.on('error', (e, err: unknown, moduleName?: string) => {
    log(`Error in browser window ${e.sender.getTitle()}${moduleName ? ` (${moduleName} module)` : ''}: ${sanitizeError(String(err))}`)
});

ipcMain.on('clipboard.write', (_e, str: string) => {
    clipboard.writeText(str);
});