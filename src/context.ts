import { app, BrowserWindow, Notification, Tray, nativeImage } from 'electron'

import getFilePath from '@utils/getFilePath';
import { join } from 'path';

const iconPath = getFilePath(
    join('resources', 'icon.png'),
    'icon.png',
    true
);

const userDataPath = app.getPath('userData');
const defaultFileFolder = join(userDataPath, 'Files');

const context = {
    main: null as BrowserWindow|null,
    webPath: join(__dirname, 'web', 'index.html'),

    popupWindows: [] as BrowserWindow[],
    focusedPopupWindowIds: new Set<number>(),

    wallpaperWindows: [] as BrowserWindow[],

    canExit: false,

    notificationsSupported: Notification.isSupported(),
    tray: null as Tray|null,

    iconPath,
    icon: nativeImage.createFromPath(iconPath),

    userDataPath,

    defaultFileFolder,
    defaultMediaFolder: join(defaultFileFolder, 'Media'),
    chatFilesFolder: join(defaultFileFolder, 'Chat'),

    ngrok: null as ControlMe.NgrokResponse|null,
    ngrokError: null as string|null,

    serverStatus: 'closed' as ControlMe.ServerStatus,
    ngrokStatus: 'closed' as ControlMe.NgrokStatus,

    sockets: [] as ControlMe.Socket[],
};

export const setServerStatus = (v: ControlMe.ServerStatus) => {
    context.serverStatus = v;
    context.main?.webContents.send('serverStatus', v);
}

export const setNgrokStatus = (v: ControlMe.NgrokStatus) => {
    context.ngrokStatus = v;
    context.main?.webContents.send('ngrokStatus', v);
}

export default context;