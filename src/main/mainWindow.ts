import { app, BrowserWindow, shell } from 'electron';
import context from 'ctx';

import { appTitle } from 'const';
import configStore from '@stores/config';

export default function createMainWindow(show: boolean = true) {
    if (context.mainWindow && show)
        return context.mainWindow.show();

    const win = context.mainWindow = new BrowserWindow({
        minWidth: 660,
        minHeight: 500,

        width: 720,
        height: 900,

        title: appTitle,
        icon: context.appIcon,

        show: false,
        resizable: true,
        autoHideMenuBar: true,

        webPreferences: {
            preload: context.preloadPaths.main,
            nodeIntegration: true
        }
    });

    win.loadFile(context.webPath, {
        query: { module: 'main' }
    });

    win.on('close', e => {
        if (configStore.get('general.exitOnClose'))
            app.quit();

        else {
            e.preventDefault();
            win.hide();
        }
    });

    win.webContents.setWindowOpenHandler(details => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });

    show && win.on('ready-to-show', win.show);
    return win;
}