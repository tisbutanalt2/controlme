import { app, dialog } from 'electron';
import { existsSync, mkdirSync } from 'fs';

import context from 'ctx';
import configStore from '@stores/config';

import { startServer } from '@ipc/server';
import log from 'log';

import createMainWindow from './mainWindow';

if (!app.requestSingleInstanceLock()) {
    dialog.showErrorBox('Already running', 'The app is already running. Please close the app before launching it again.');
    app.quit();
}

// Create folders if they don't exist
if (!existsSync(context.fileFolder)) mkdirSync(context.fileFolder);
if (!existsSync(context.mediaFolder)) mkdirSync(context.mediaFolder);
if (!existsSync(context.logFolder)) mkdirSync(context.logFolder);
if (!existsSync(context.tempFolder)) mkdirSync(context.tempFolder);

app.on('ready', async () => {
    createMainWindow(!configStore.get('general.startMinimized'));

    if (configStore.get('server.autoStart')) {
        let port = configStore.get('server.port') as number|undefined;
        if (typeof port !== 'number' || port < 0) port = 0;

        const serverErr = await startServer(port);
        if (!serverErr) {
            log(`Server listening on port ${context.server.port}`);

            if (configStore.get('ngrok.autoStart')) {
                // Start ngrok automatically
            }
        }
    }
});