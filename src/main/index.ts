import { app, dialog, globalShortcut } from 'electron';
import { existsSync, mkdirSync } from 'fs';

import AutoLaunch from 'auto-launch';

import context from 'ctx';
import configStore from '@stores/config';
import { appTitle, isDev } from 'const';

import { startServer } from '@ipc/server';
import log from 'log';

import createMainWindow from './mainWindow';
import createNotificationWindow from './notificationWindow';
import createPopupWindows from './popupWindows';
import createTray from './tray';

import './ipc';

if (process.platform === 'win32') {
    app.setAppUserModelId(appTitle);
}

if (!app.requestSingleInstanceLock()) {
    dialog.showErrorBox('Already running', 'The app is already running. Please close the app before launching it again.');
    app.quit();
}

const autoLauncher = new AutoLaunch({
    name: 'controlme',
    path: app.getPath('exe')
});

// Create folders if they don't exist
if (!existsSync(context.fileFolder)) mkdirSync(context.fileFolder);
if (!existsSync(context.mediaFolder)) mkdirSync(context.mediaFolder);
if (!existsSync(context.logFolder)) mkdirSync(context.logFolder);
if (!existsSync(context.tempFolder)) mkdirSync(context.tempFolder);

app.on('ready', async () => {
    if (!isDev) {
        const autoStart = Boolean(configStore.get('general.launchOnStartup'));
        autoLauncher.isEnabled().then(v => {
            if (v && !autoStart) return autoLauncher.disable();
            if (!v && autoStart) autoLauncher.enable();
        });

        configStore.onDidChange('general.launchOnStartup' as keyof ControlMe.Settings, (v: unknown) => {
            const autoStart = Boolean(v);
            autoLauncher.isEnabled().then(v => {
                if (v && !autoStart) return autoLauncher.disable();
                if (!v && autoStart) return autoLauncher.enable();
            });
        });
    }

    createMainWindow(!configStore.get('general.startMinimized'));
    createNotificationWindow();
    createPopupWindows();
    createTray();

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

    // Panic keybind
    !Boolean(configStore.get('security.disablePanicKeybind')) && globalShortcut.register('CommandOrControl+P', app.quit);

    configStore.onDidChange('security.disablePanicKeybind' as keyof ControlMe.Settings, (v: unknown) => {
        const disabled = Boolean(v);

        if (disabled) globalShortcut.unregister('CommandOrControl+P');
        else globalShortcut.register('CommandOrControl+P', app.quit);
    });

    log(`Running ${isDev ? 'electron' : 'app'} version ${app.getVersion()}`);
});