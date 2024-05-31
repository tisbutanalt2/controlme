import { Notification, ipcMain } from 'electron';
import { default as startExpress } from '@server/index';

import context from '@main/context';
import configStore from '@utils/store/config';

import sanitizeError from '@utils/sanitizeError';

export const startServer = async (port: number = configStore.get('server.port')) => {
    if (context.statuses.server === 'open') return console.warn('Server was attempted started when already running');

    // Port edge cases
    typeof port !== 'number' && (port = 0);
    port = Math.max(port, 0);

    context.statuses.server = 'starting';
    
    try {
        if (context.server) {
            context.server.http.listen(port);
            context.statuses.server = 'open';
            return;
        }

        const res = await startExpress(port)
        if (res.error) {
            context.statuses.server = 'error';
            context.errors.server = sanitizeError(res.error);

            context.server = null;
            return res;
        }

        context.statuses.server = 'open';
        context.server = res;

        configStore.get('server.notification') && new Notification({
            title: 'Server started',
            icon: context.appIcon,
            body: `Listening on port ${res.port}`
        }).show();
    } catch(err) {
        console.error('Failed to start server');
        console.error(err);

        context.statuses.server = 'error';
        context.errors.server = sanitizeError(err);

        context.server = null;
    }
}

const closeServer = () => {
    if (!context.server) return;

    context.server.http.close();
    context.statuses.server = 'closed';

    context.server = null;
}

export const stopServer = async () => {
    if (context.statuses.server !== 'open') return console.warn('Server was attempted closed when not running');
    if (context.statuses.ngrok !== 'closed') context.ngrok?.disconnect();

    context.server.io.close(closeServer);

    // Edge case
    setTimeout(closeServer, 500);
}

export const restartServer = () => {
    stopServer();
    setTimeout(startServer, 1000);
}

ipcMain.handle('startServer', () => startServer());
ipcMain.handle('stopServer', () => stopServer());
ipcMain.handle('restartServer', () => restartServer());