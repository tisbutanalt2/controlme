import { app, Menu, Tray } from 'electron';
import context from 'ctx';

import { appTitle, isDev } from 'const';
import createMainWindow from './mainWindow';

const refreshMain = () => context.mainWindow?.webContents.reload();

const refreshPopups = () => context.modules.popup.forEach(win => {
    context.endPassthroughCallbacks.popup.forEach(cb => cb());
    win.webContents.reload();
    win.setIgnoreMouseEvents(true, { forward: true });
});

const refreshNotification = () => {
    context.endPassthroughCallbacks.notification?.();
    context.modules.notification?.webContents.reload();
}

const refreshBackgroundTasks = () => {
    context.modules.backgroundTasks?.webContents.reload();
}

export default function createTray() {
    const template: Electron.MenuItemConstructorOptions[] = [
        {
            label: 'Open control panel',
            click: () => createMainWindow(true)
        },

        {
            label: 'Refresh',
            type: 'submenu',
            submenu: [
                {
                    label: 'All',
                    click: () => {
                        refreshMain();
                        refreshPopups();
                        refreshNotification();
                        refreshBackgroundTasks();
                    }
                },

                {
                    label: 'Control panel',
                    click: refreshMain
                },

                {
                    label: 'Popups',
                    click: refreshPopups
                },
        
                {
                    label: 'Notifications',
                    click: refreshNotification
                },

                {
                    label: 'Background tasks',
                    click: () => refreshBackgroundTasks
                }
            ]
        },

        { type: 'separator' },

        {
            label: 'Exit',
            click: app.quit
        }
    ];

    isDev && template.push(
        { type: 'separator' },
        {
            label: 'Dev',
            type: 'submenu',
            submenu: [
                {
                    label: 'Toggle devtools (main)',
                    click: () => context.mainWindow?.webContents?.isDevToolsOpened()
                        ? context.mainWindow?.webContents.closeDevTools()
                        : context.mainWindow?.webContents.openDevTools()
                },

                {
                    label: 'Toggle devtools (notification)',
                    click: () => context.modules.notification?.webContents.isDevToolsOpened()
                        ? context.modules.notification?.webContents.closeDevTools()
                        : context.modules.notification?.webContents.openDevTools()
                }
            ]
        }
    );

    const menu = Menu.buildFromTemplate(template);
    const tray = context.tray = new Tray(context.appIcon);

    tray.setTitle(appTitle);
    tray.setToolTip(appTitle);
    tray.setContextMenu(menu);

    const menuFocus = () => {
        // Ignore mouse events on web viewers
    };

    const menuBlur = () => {
        // Allow mouse events on web viewers
    };

    // Open main window on click
    tray.on('click', () => createMainWindow(true));

    menu.on('menu-will-show', menuFocus);
    menu.on('menu-will-close', menuBlur);

    return tray;
}