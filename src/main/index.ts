import { app, dialog, globalShortcut } from 'electron';

import { autoUpdater } from 'electron-updater';
autoUpdater.autoDownload = false;

import { join } from 'path';
import { existsSync, mkdirSync, rmSync, readdirSync } from 'fs';

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
if (!existsSync(context.defaultFileFolder)) mkdirSync(context.defaultFileFolder);
if (!existsSync(context.defaultMediaFolder)) mkdirSync(context.defaultMediaFolder);
if (!existsSync(context.logFolder)) mkdirSync(context.logFolder);
if (!existsSync(context.tempFolder)) mkdirSync(context.tempFolder);

// Delete existing temp files
try {
    const files = readdirSync(context.tempFolder);
    files.forEach(f => rmSync(join(context.tempFolder, f)));
} catch {}

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

// Auto update
if (!isDev) {
    autoUpdater.on('update-available', info => {
        log(`Update available: ${info.version}`);
        dialog.showMessageBox({
            type: 'question',
            title: 'Update Available',
            message: `A new version (${info.version}) is available! Do you want to download it?`,
            buttons: ['Download', 'Ignore']
        }).then(res => {
            if (res.response === 0)
                autoUpdater.downloadUpdate();
        })
    });
    
    autoUpdater.on('update-downloaded', info => {
        log(`Update downloaded: ${info.version}`);
    
        dialog.showMessageBox({
            type: 'question',
            title: 'Update Ready',
            message: 'The update has been downloaded. Restart the app to install it now?'
        }).then(res => {
            if (res.response === 0) autoUpdater.quitAndInstall()
        })
    });
}