import { app, Tray, Menu } from 'electron';
import context from '@main/context';

import { appTitle, isDev } from '@utils/constants';
import createWindow from './window';

export default function createTray() {
    const template: Electron.MenuItemConstructorOptions[] = [
        {
            label: 'Open main window',
            click: () => context.mainWindow
                ?context.mainWindow.show()
                :createWindow()
        },

        {
            label: 'Refresh popup windows',
            click: () => context.modules.popup.forEach(win => {
                win.webContents.reload();
                win.setIgnoreMouseEvents(true, { forward: true });
            })
        },

        {
            label: 'Refresh notification window',
            click: () => context.modules.notification?.webContents.reload()
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
            label: 'DEV',
            type: 'submenu',
            submenu: [
                {
                    label: 'Open devtools (main)',
                    click: () => context.mainWindow?.webContents.openDevTools()
                },

                {
                    label: 'Open devtools (popups)',
                    click: () => context.modules.popup.forEach(win => {
                        win.webContents.openDevTools();
                        win.setIgnoreMouseEvents(false);

                        const listener = () => {
                            win.setIgnoreMouseEvents(true, { forward: true });
                            win.webContents.off('devtools-closed', listener);
                        }
                        
                        win.webContents.on('devtools-closed', listener);
                    })
                }
            ]
        }
    )

    const menu = Menu.buildFromTemplate(template);

    const tray = context.tray = new Tray(context.appIcon);

    tray.setTitle(appTitle);
    tray.setToolTip(appTitle);
    tray.setContextMenu(menu);

    const menuFocus = () => {
        context.modules.notification?.setIgnoreMouseEvents(true, { forward: false });
        context.modules.popup.forEach(win => win.setIgnoreMouseEvents(true, { forward: false }));
    }

    const menuBlur = () => {
        context.modules.notification?.setIgnoreMouseEvents(true, { forward: true });
        context.modules.popup.forEach(win => win.setIgnoreMouseEvents(true, { forward: true }));
    }

    // Open main window on click
    tray.on('click', () => {
        context.mainWindow
            ?context.mainWindow.show()
            :createWindow()

            menuBlur();
    });

    menu.on('menu-will-show', menuFocus);
    menu.on('menu-will-close', menuBlur);

    return tray;
}