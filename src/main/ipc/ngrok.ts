import { ipcMain } from 'electron';

import context from '@main/context';
import connectNgrok from '@server/tunnel';

import sanitizeError from '@utils/sanitizeError';

export const startNgrok = async () => {
    if (context.statuses.server !== 'open' || !context.server) return console.warn('Ngrok was attempted started when server isn\'t running');
    if (context.statuses.ngrok === 'starting' || context.statuses.ngrok === 'open') return console.warn('Ngrok was attempted started when already running');

    context.statuses.ngrok = 'starting';

    const port = context.server.port;
    const res = await connectNgrok(port);

    if (typeof res !== 'object') {
        context.statuses.ngrok = 'error';
        context.errors.ngrok = sanitizeError(res);
        
        context.ngrok = null;
        return res;
    }

    context.statuses.ngrok = 'open';
    context.mainWindow?.webContents.send('ngrokUrl', res.url);

    context.ngrok = res;
}

export const stopNgrok = () => {
    if (context.statuses.ngrok !== 'open' || !context.ngrok) return console.warn('Ngrok was attempted closed when not running');

    context.ngrok.tunnel.close();

    context.statuses.ngrok = 'closed';
    context.ngrok = null;
}

ipcMain.handle('startNgrok', () => startNgrok());
ipcMain.handle('stopNgrok', () => stopNgrok());

ipcMain.handle('ngrokUrl', () => context.ngrok?.url);