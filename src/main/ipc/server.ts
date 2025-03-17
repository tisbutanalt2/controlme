import { ipcMain } from 'electron';

import context from 'ctx';

import startExpress from 'server';
import { ServerStatus } from 'enum';

import { displayNotification } from './notification';

import sanitizeError from '@utils/sanitizeError';
import log from 'log';
import configStore from '@stores/config';

export const startServer = async (port: number = 3000) => {
    if (context.statuses.server === ServerStatus.Open) return console.warn('startServer was called when server is already running');
    if (context.statuses.server === ServerStatus.Starting) return console.warn('startServer was called when server is already starting');

    context.statuses.server = ServerStatus.Starting;

    typeof port !== 'number' && (port = 0);
    port = Math.max(port, 0);

    try {
        if (context.server) {
            // Start existing server
            context.server.http.listen(port);
            context.statuses.server = ServerStatus.Open;
            return;
        }

        // Start new server here
        const res = await startExpress(port);
        if (typeof res !== 'object') {
            context.statuses.server = ServerStatus.Error;
            context.errors.server = sanitizeError(res);

            context.server = null;
            return res;
        }

        context.statuses.server = ServerStatus.Open;
        context.server = res;

        configStore.get('server.notifyOnStart') && displayNotification({
            title: 'Server started',
            message: `Listening on port ${res.port}`,
            timeout: 5000
        }, true);
    } catch(err) {
        log(`Failed to start server: ${sanitizeError(err)}`);

        context.statuses.server = ServerStatus.Error;
        context.errors.server = sanitizeError(err);

        context.server = null;
    }
}

const closeServer = () => {
    if (!context.server) return;

    context.server.http.close();
    context.statuses.server = ServerStatus.Closed;

    context.server = null;
}

export const stopServer = async () => {
    if (context.statuses.server !== ServerStatus.Open) return console.warn('stopServer was called when server is already closed');
    await context.server.io.close(closeServer);

    // Edge case
    setTimeout(closeServer, 1000);
}

export const restartServer = async () => {
    await stopServer();
    setTimeout(startServer, 1000);
}

ipcMain.handle('server.start', () => startServer());
ipcMain.handle('server.stop', () => stopServer());
ipcMain.handle('server.restart', () => restartServer());