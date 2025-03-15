import { BrowserWindow, app, shell } from 'electron';
import configStore from '@utils/store/config';

import context from '@main/context';
import { appTitle } from '@utils/constants';

export default function createWindow(show: boolean = true) {
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
            nodeIntegration: true,
            preload: context.preloadPaths.main
        }
    });

    win.loadFile(context.webPath, {
        query: { module: 'main' }
    });

    win.on('close', e => {
        if (configStore.get('general.exitOnClose')) {
            app.quit();
        }

        else {
            e.preventDefault();
            win.hide();
        }
    });

    win.webContents.setWindowOpenHandler(details => {
        shell.openExternal(details.url);
        return {
            action: 'deny'
        };
    })

    win.on('ready-to-show', () => show && win.show());
    return win;
}