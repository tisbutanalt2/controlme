import { BrowserWindow, screen } from 'electron';
import context from '@main/context';

import { appTitle } from '@utils/constants';

export default async function createNotificationWindow() {
    const mainScreen = screen.getPrimaryDisplay();

    const marginX = 20;
    const marginY = 100;

    const width = 300;
    const height = Math.min(800, mainScreen.bounds.height - marginY);

    const win = context.modules.notification = new BrowserWindow({
        width,
        height,

        x: mainScreen.bounds.width - width - marginX,
        y: mainScreen.bounds.height - height - marginY,

        title: `${appTitle} Notifications`,
        icon: context.appIcon,
        transparent: true,
        frame: false,

        show: false,
        resizable: false,
        autoHideMenuBar: true,
        skipTaskbar: true,

        alwaysOnTop: true,

        webPreferences: {
            nodeIntegration: true,
            preload: context.preloadPaths.notification
        }
    });

    win.setAlwaysOnTop(true, 'pop-up-menu');
    win.setIgnoreMouseEvents(true, { forward: true });

    await win.loadFile(context.webPath, {
        query: { module: 'notification' }
    });

    win.show();
    win.blur();


    // TEMP
    //win.hide();

    return win;
}