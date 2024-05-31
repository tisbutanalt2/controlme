import { BrowserWindow } from 'electron';
import context from '@main/context';

import { appTitle } from '@utils/constants';

export default function createWindow() {
    if (context.mainWindow)
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

    win.on('ready-to-show', win.show);
    return win;
}