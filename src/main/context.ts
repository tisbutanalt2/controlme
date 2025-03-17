import { app, nativeImage } from 'electron';
import { join, resolve } from 'path';

import { isDev } from 'const';
import { ServerStatus } from 'enum';

//import configStore from '@stores/config';
import authStore from '@stores/auth';

import StatusProxy from './statusProxy';

const baseAppPath = app.getAppPath();
const appPath = isDev
    ? resolve(baseAppPath, '..')
    : join(baseAppPath, 'app');

const appIconPath = isDev
    ? join('assets', 'icon.png')
    : resolve(baseAppPath, '..', 'assets', 'icon.png');

const preloadPath = join(appPath, 'preload');
const userDataPath = app.getPath('userData');

const initTime = new Date();
const initTimestamp = initTime.toLocaleString('en-uk')
    .replace(/^(\d+)\/(\d+)\/(\d+), (\d+:\d+:\d+)$/, '$3-$2-$1 $4')
    .replace(/:/g, '.');

const context = {
    version: app.getVersion(),
    initTime,
    initTimestamp,

    mainWindow: undefined as Electron.BrowserWindow|undefined,
    mainWindowMoving: false,

    modules: {
        popup: [] as Array<Electron.BrowserWindow>,
        notification: undefined as Electron.BrowserWindow|undefined,
        backgroundTasks: undefined as Electron.BrowserWindow|undefined
    },

    endPassthroughCallbacks: {
        popup: [] as Array<(() => void)>,
        notification: undefined as (() => void)|undefined
    },

    webPath: join(appPath, 'web', 'index.html'),
    preloadPaths: {
        main: join(preloadPath, 'main', 'index.js'),
        popup: join(preloadPath, 'popup.js'),
        notification: join(preloadPath, 'notification.js')
    },

    // Shortcuts (not used)
    //config: configStore,
    //auth: authStore,
    secret: String(authStore.get('secret')),

    userDataPath,

    fileFolder: join(userDataPath, 'Files'),
    mediaFolder: join(userDataPath, 'Media'),
    logFolder: join(userDataPath, 'Logs'),
    tempFolder: join(userDataPath, 'Temp'),

    appIconPath,
    appIcon: nativeImage.createFromPath(appIconPath),

    tray: undefined as Electron.Tray|undefined,
    sockets: [] as Array<ControlMe.Socket>,

    statuses: new StatusProxy<ControlMe.Statuses>('status', {
        server: ServerStatus.Closed,
        ngrok: ServerStatus.Closed
    }) as ControlMe.Statuses,

    errors: new StatusProxy<ControlMe.Errors>('errors', {
        server: undefined,
        ngrok: undefined
    }) as ControlMe.Errors,

    server: undefined as ControlMe.Server|undefined,
    ngrok: undefined //as ControlMe.Ngrok|undefined
}

export default context;