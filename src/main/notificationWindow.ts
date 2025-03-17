import { BrowserWindow, screen } from 'electron';
import context from 'ctx';

import { appTitle } from 'const';
import transparentPassthrough from '@utils/transparentPassthrough';

const marginX = 0;
const marginY = 80;

const width = 300;

export default async function createNotificationWindow() {
    const mainScreen = screen.getPrimaryDisplay();
    const height = mainScreen.bounds.height - marginY;

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
            preload: context.preloadPaths.notification,
            nodeIntegration: true
        }
    });

    win.setAlwaysOnTop(true, 'pop-up-menu');
    win.setIgnoreMouseEvents(true);

    await win.loadFile(context.webPath, {
        query: { module: 'notification' }
    });

    win.on('ready-to-show', async () => {
        context.endPassthroughCallbacks.notification?.();
        win.show();

        const endPassthrough = await transparentPassthrough(win);
        context.endPassthroughCallbacks.notification = () => {
            endPassthrough();
            context.endPassthroughCallbacks.notification = undefined;
        };
    });

    win.blur();
    return win;
}