import { app, globalShortcut, dialog } from 'electron';

// Disable hardware acceleration
/*app.disableHardwareAcceleration();
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-gpu-rasterization');
app.commandLine.appendSwitch('disable-gpu-sandbox');*/

import AutoLaunch from 'auto-launch';

import context from '@main/context';
import { appTitle, isDev } from '@utils/constants';

import configStore from '@utils/store/config';

import createWindow from './window';
import createTray from './tray';
import createPopupWindows from './popupWindows';
import createNotificationWindow from './notificationWindow';

// Import IPC handlers
import './ipc';
import { startServer } from './ipc/server';
import { startNgrok } from './ipc/ngrok';

if (process.platform === 'win32') {
    app.setAppUserModelId(appTitle);
    //autoUpdater.checkForUpdatesAndNotify()
}

if (!app.requestSingleInstanceLock()) {
    dialog.showErrorBox('Already running', `${appTitle} is already running. Please close the app before launching it again.`);
    app.quit();
}

const autoLauncher = new AutoLaunch({
    name: 'controlme',
    path: app.getPath('exe'),
    isHidden: true
});

app.on('ready', () => {
    createPopupWindows();
    createNotificationWindow();
    createTray();
    
    createWindow(!configStore.get('general.startMinimized'));

    configStore.get('server.autoStart') && startServer().then(err => {
        if (err) return;
        configStore.get('ngrok.autoStart') && startNgrok();
    });

    const autoStart = Boolean(configStore.get('general.launchOnStartup'));
    autoLauncher.isEnabled().then(v => {
        if (v && !autoStart) return autoLauncher.disable();
        if (!v && autoStart) return autoLauncher.enable();
    });

    if (!isDev) {
        [context.mainWindow, /*...context.modules.popup,*/ context.modules.backgroundTasks]
            .filter(win => win !== null)
            .forEach(win => {
                win.on('focus', () => {
                    globalShortcut.register('CommandOrControl+R', () => {});
                });
        
                win.on('blur', () => {
                    globalShortcut.unregister('CommandOrControl+R');
                });
            })
    }

    !configStore.get('security.disablePanicKeybind') && globalShortcut.register('CommandOrControl+P', app.quit);

    // Add panic keybind
    configStore.onDidChange('security.disablePanicKeybind' as keyof ControlMe.Settings, (newValue) => {
        const disabled = newValue as unknown as boolean;
        if (disabled) globalShortcut.unregister('CommandOrControl+P');

        else globalShortcut.register('CommandOrControl+P', app.quit);
    })

    console.log(`Running app version ${app.getVersion()}`);
});