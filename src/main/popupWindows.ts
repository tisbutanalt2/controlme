import { BrowserWindow, screen } from 'electron';
import context from 'ctx';

import { appTitle } from 'const';
import transparentPassthrough from '@utils/transparentPassthrough';

export default function createPopupWindows() {
    const displays = screen.getAllDisplays();
    displays.forEach(async display => {
        const { x, y, width, height } = display.bounds;

        const win = new BrowserWindow({
            transparent: true,
            frame: false,
            
            show: false,
            resizable: false,
            autoHideMenuBar: true,
            skipTaskbar: true,
            
            title: `${appTitle} Popup Overlay`,
            webPreferences: {
                preload: context.preloadPaths.popup,
                nodeIntegration: true
            },
            
            fullscreen: true,
            enableLargerThanScreen: true,
            minimizable: false,
            
            x,
            y,
            width,
            height
        });

        win.setAlwaysOnTop(true, 'screen-saver');
        win.setIgnoreMouseEvents(true);

        await win.loadFile(context.webPath, {
            query: { module: 'popup' }
        });

        context.modules.popup.push(win);

        win.on('close', () => {
            const i = context.modules.popup.indexOf(win);
            i >= 0 && context.modules.popup.splice(i, 1);
        });

        win.on('ready-to-show', async () => {
            win.show();
            win.blur();

            const removePassthroughListeners = await transparentPassthrough(win, true);
            const removeListeners = () => {
                removePassthroughListeners();

                const index = context.endPassthroughCallbacks.popup.indexOf(removeListeners);
                index >= 0 && context.endPassthroughCallbacks.popup.splice(index, 1);
            };

            context.endPassthroughCallbacks.popup.push(removeListeners);
        });
    })
}