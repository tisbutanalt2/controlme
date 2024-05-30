import { app, nativeImage } from 'electron';
import { join } from 'path';

import StatusProxy from './statusProxy';

const appIconPath = join(__dirname, 'assets', 'icon.png');
const userDataPath = app.getPath('userData');
const preloadPath = join(__dirname, 'preload');

const context = {
    version: app.getVersion(),
    
    mainWindow: null as Electron.BrowserWindow|null,
    modules: {
        popup: [] as Electron.BrowserWindow[],
        backgroundTasks: null as Electron.BrowserWindow|null
    },

    webPath: join(__dirname, 'web', 'index.html'),
    preloadPaths: {
        main: join(preloadPath, 'main', 'index.js'),
        popup: join(preloadPath, 'popup.js')
    },

    userDataPath,
    fileFolder: join(userDataPath, 'Files'),
    mediaFolder: join(userDataPath, 'Media'),

    appIconPath,
    appIcon: nativeImage.createFromPath(appIconPath),

    tray: null as Electron.Tray|null,
    sockets: [] as ControlMe.Socket[],

    statuses: new StatusProxy('Status', {
        server: 'closed',
        ngrok: 'closed'
    }),

    errors: new StatusProxy('Error') as unknown as ControlMe.Errors,

    server: null as ControlMe.ServerResponse|null,
    ngrok: null as ControlMe.NgrokResponse|null
}

export default context;