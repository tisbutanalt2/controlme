import { app, BrowserWindow, globalShortcut, shell } from 'electron';
import context from 'ctx';

import { appTitle, isDev } from 'const';
import configStore from '@stores/config';

export default function createMainWindow(show: boolean = true) {
    if (context.mainWindow && show)
        return context.mainWindow.show();

    const win = context.mainWindow = new BrowserWindow({
        minWidth: 660,
        minHeight: 500,

        width: 700,
        height: 900,

        title: appTitle,
        icon: context.appIcon,
        transparent: false,

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

    let movedListenersAdded = false;
    win.on('ready-to-show', () => {
        show && win.show();
        if (movedListenersAdded) return;
        
        win.on('move', () => context.mainWindowMoving = true);
        win.on('moved', () => context.mainWindowMoving = false);

        movedListenersAdded = true;
    });

    if (isDev) {
        win.on('focus', () => globalShortcut.register('CommandOrControl+R', () => win.webContents.reload()));
        win.on('blur', () => globalShortcut.unregister('CommandOrControl+R'));
    }
    
    return win;
}