import { clipboard, ipcMain } from 'electron';
import context from 'ctx';

import log from 'log';
import sanitizeError from '@utils/sanitizeError';

import './config';
import './server';
import './ngrok';

ipcMain.handle('version', () => context.version);
ipcMain.on('error', (e, err: unknown, moduleName?: string) => {
    log(`Error in browser window ${e.sender.getTitle()}${moduleName ? ` (${moduleName} module)` : ''}: ${sanitizeError(String(err))}`)
})