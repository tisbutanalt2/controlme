import { app, nativeImage } from 'electron';
import { join, resolve } from 'path';

import configStore from '@utils/store/config';
import authStore from '@utils/store/auth';

import StatusProxy from './statusProxy';
import getAssetPath from '@utils/getAssetPath';

const appPath = resolve(app.getAppPath(), '..');

const appIconPath = getAssetPath('icon.png');
const preloadPath = join(appPath, 'preload');

const userDataPath = app.getPath('userData');

const context = {
    version: app.getVersion(),
    
    mainWindow: null as Electron.BrowserWindow|null,
    modules: {
        popup: [] as Electron.BrowserWindow[],
        backgroundTasks: null as Electron.BrowserWindow|null
    },

    webPath: join(appPath, 'web', 'index.html'),
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
    }) as unknown as ControlMe.Statuses,

    errors: new StatusProxy('Error', {
        server: null,
        ngrok: null
    }) as unknown as ControlMe.Errors,

    server: null as ControlMe.Server|null,
    ngrok: null as ControlMe.Ngrok|null,

    configStore,
    authStore
}

export default context;