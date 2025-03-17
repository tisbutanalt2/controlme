import { ipcMain } from 'electron';
import { ServerStatus } from 'enum';

import context from 'ctx';
import connectNgrok from '@server/ngrok';

import log from 'log';
import sanitizeError from '@utils/sanitizeError';

export const startNgrok = async () => {
    if (context.statuses.ngrok === ServerStatus.Starting) return console.warn('startNgrok was called when tunnel is already starting')
    if (context.statuses.ngrok === ServerStatus.Open) return console.warn('startNgrok was called when tunnel is already running');

    context.statuses.ngrok = ServerStatus.Starting;

    const port = context.server.port;
    const res = await connectNgrok(port);

    if (typeof res === 'string') {
        context.statuses.ngrok = ServerStatus.Error;
        context.errors.ngrok = sanitizeError(res);

        context.ngrok = undefined;
        log(res, 'error');

        return res;
    }

    context.statuses.ngrok = ServerStatus.Open;
    context.mainWindow?.webContents.send('ngrok.url', res.url);

    context.ngrok = res;
}

export const stopNgrok = async () => {
    if (context.statuses.ngrok !== ServerStatus.Open || !context.ngrok) return console.warn('stopNgrok was called when tunnel is not running');
    context.ngrok?.tunnel.close();

    context.statuses.ngrok = ServerStatus.Closed;
    context.ngrok = undefined;
}

export const restartNgrok = async () => {
    if (context.statuses.ngrok !== ServerStatus.Open || !context.ngrok) return console.warn('restartNgrok was called when tunnel is not running');

    await stopNgrok();
    setTimeout(startNgrok, 500);
}

ipcMain.handle('ngrok.start', () => startNgrok());
ipcMain.handle('ngrok.stop', () => stopNgrok());
ipcMain.handle('ngrok.restart', () => restartNgrok());

ipcMain.handle('ngrok.url', () => context.ngrok?.url);