import { app, globalShortcut, dialog } from 'electron';

import context from '@main/context';
import { appTitle, isDev } from '@utils/constants';

import configStore from '@utils/store/config';

import createWindow from './window';
import createTray from './tray';

import './ipc';

if (process.platform === 'win32') {
    app.setAppUserModelId(appTitle);
    //autoUpdater.checkForUpdatesAndNotify()
}

if (!app.requestSingleInstanceLock()) {
    dialog.showErrorBox('Already running', `${appTitle} is already running. Please close the app before launching it again.`);
    app.quit();
}

app.on('ready', () => {
    !configStore.get('general.startMinimized') && createWindow();
    createTray();

    // configStore.get('server.autoStart') && startServer()

    if (!isDev) {
        [context.mainWindow, /*...context.modules.popup,*/ context.modules.backgroundTasks]
            .filter(win => win !== null)
            .forEach(win => {
                win.on('focus', () => {
                    globalShortcut.register('CommandOrControl+R', () => {});
                });
        
                win.on('blur', () => {
                    globalShortcut.unregister('CommandOrControl+R');
                });
            })
    }

    console.log(`Running app version ${app.getVersion()}`);
});