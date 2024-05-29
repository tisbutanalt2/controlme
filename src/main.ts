import {
    app,
    BrowserWindow,
    Tray,
    Menu,
    shell,
    globalShortcut,
    screen
} from 'electron';

import { existsSync, mkdirSync } from 'fs';
import { autoUpdater } from 'electron-updater';

import { join } from 'path';
import configStore from '@utils/store/config';

import { startNgrok, startServer } from './ipc';
import { appTitle } from '@utils/constants';

export const preloadPath = join(__dirname, 'preload.js');
export const preloadPopupPath = join(__dirname, 'preloadPopup.js');

import context from './context';

import isDev from '@utils/isDev';

console.log(`Running app version ${app.getVersion()}`);
console.log(`Userdata located at ${context.userDataPath}`);

if (!existsSync(context.defaultFileFolder)) mkdirSync(context.defaultFileFolder);
if (!existsSync(context.defaultMediaFolder)) mkdirSync(context.defaultMediaFolder);

if (process.platform == 'win32') {
    app.setAppUserModelId(appTitle);
    autoUpdater.checkForUpdatesAndNotify()
}

const createWindow = () => {
    if (context.main) {
        context.main.show();
        return;
    }

    const main = context.main = new BrowserWindow({
        minWidth: 660,
        minHeight: 420,
        
        width: 720,
        height: 900,

        title: appTitle,
        icon: context.icon,
        show: false,

        webPreferences: {
            nodeIntegration: false,
            preload: preloadPath,
            contextIsolation: true
        },

        autoHideMenuBar: true,
        resizable: true
    });

    main.loadFile(context.webPath, { query: { module: 'main' } });
    main.webContents.on('dom-ready', () => {
        main.show();
    });

    main.on('close', e => {
        if (configStore.get('general.exitOnClose')) {
            return app.quit();   
        }
        if (context.canExit) return;

        e.preventDefault();
        main.hide();
    });

    main.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    globalShortcut.register('CommandOrControl+Shift+P', () => !configStore.get('security.disablePanicKeybind') && app.quit());

    if (!isDev) {
        main.on('focus', () => {
            globalShortcut.register('CommandOrControl+R', () => {});
        });
    
        main.on('blur', () => {
            globalShortcut.unregister('CommandOrControl+R');
        });
    }
}

app.on('ready', async () => {
    !configStore.get('general.startMinimized') && createWindow();
    const tray = context.tray = new Tray(context.icon);

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Open control panel', type: 'normal', click() {
            if (!context.main) createWindow();
            context.main?.show();
        }},
        { type: 'separator' },
        ...(isDev? [
            {
                label: 'Close popup windows',
                click() {
                    context.popupWindows.forEach(win => win.close());
                    context.popupWindows = [];
                }
            },

            {
                label: 'Open devtools',
                click() { context.main.webContents.openDevTools() }
            }
        ]: []),
        { label: 'Exit', type: 'normal', click() {
            context.canExit = true;
            app.quit();
        }}
    ]);

    tray.removeBalloon();
    tray.setTitle(appTitle);
    tray.setToolTip(appTitle);
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        if (!context.main) createWindow();
        context.main?.show();
    });

    configStore.get('server.autoStart') && startServer().then(() => {
        if (configStore.get('ngrok.autoStart')) {
            startNgrok().then(res => {
                res.url && context.main?.webContents.send('ngrokURL', res.url);
                context.main?.webContents.on('dom-ready', () => context.main.webContents.send('ngrokURL', res.url));
            });
        }
    });

    // Popup stuff :3
    const displays = screen.getAllDisplays();
    displays.forEach(async display => {
        const popupWindow = new BrowserWindow({
            autoHideMenuBar: true,
            show: false,
            frame: false,
            transparent: true,
            skipTaskbar: true,
            fullscreen: true,
            minimizable: false,

            webPreferences: {
                nodeIntegration: false,
                preload: preloadPopupPath,
                contextIsolation: true
            },

            x: display.bounds.x,
            y: display.bounds.y,
            width: display.bounds.width,
            height: display.bounds.height
        });

        popupWindow.maximize();
        popupWindow.setAlwaysOnTop(true, 'screen-saver');
        
        popupWindow.setIgnoreMouseEvents(true, { forward: true });
        await popupWindow.loadFile(context.webPath, { query: { module: 'popup' }});
        
        popupWindow.show();
        context.popupWindows.push(popupWindow);
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});

app.on('activate', () => {
    !context.main && createWindow();
});

app.on('will-quit', () => {
    context.tray?.destroy();
});