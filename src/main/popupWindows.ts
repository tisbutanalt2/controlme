import { BrowserWindow, screen } from 'electron';
import context from '@main/context';

import { appTitle } from '@utils/constants';

export default function createPopupWindows() {
    const displays = screen.getAllDisplays();
    displays.forEach(async display => {
        const { x, y, width, height } = display.bounds;

        const win = new BrowserWindow({
            show: false,
            transparent: true,
            frame: false,

            autoHideMenuBar: true,
            skipTaskbar: true,

            fullscreen: true,
            minimizable: false,
            
            resizable: false,
            enableLargerThanScreen: true,

            title: `${appTitle} Popup Overlay`,
            webPreferences: {
                nodeIntegration: true,
                preload: context.preloadPaths.popup
            },

            x,
            y,
            width,
            height
        });

        win.setAlwaysOnTop(true, 'screen-saver');
        win.setIgnoreMouseEvents(true, { forward: true });
        
        await win.loadFile(context.webPath, {
            query: { module: 'popup' }
        });

        // Add to popup array
        context.modules.popup.push(win);
        
        // Remove from popup array on close
        win.on('close', () => {
            const index = context.modules.popup.indexOf(win);
            index >= 0 && context.modules.popup.splice(index, 1);
        });

        win.show();
        win.blur();
    });
}