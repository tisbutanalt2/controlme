import { app, clipboard, ipcMain, Notification, shell } from 'electron';
import { randomUUID } from 'crypto';

import configStore from '@utils/store/config';
import authStore from '@utils/store/auth';

import { default as startExpress } from './server';
import connectNgrok from './connectNgrok';

import waitForSeconds from '@utils/promise/waitForSeconds';

import context, { setNgrokStatus, setServerStatus } from './context';

ipcMain.handle('getConfig', () => {
    return configStore.store;
});

ipcMain.handle('getConfigValue', (e, key: string) => {
    return configStore.get(key);
})

ipcMain.handle('setConfigValue', (e, key: string, value: any) => {
    configStore.set(key, value);
});

const listening: string[] = [];
ipcMain.on('onConfigValueChange', (e, key: string) => {
    if (listening.includes(key)) return;
    listening.push(key);

    configStore.onDidChange(key as keyof ControlMe.Settings, newValue => {
        context.main?.webContents.send('configValueChange', key, newValue);
    });
});

let port: number = configStore.get('server.port') || 0;
let srv: ControlMe.ServerResponse|null = null;

const showNotification = () => {
    if (configStore.get('server.notification')) {
        context.notificationsSupported && new Notification({
            title: 'Server started',
            icon: context.icon,
            body: `Listening on port ${srv.port}`,
            actions: [{
                type: 'button',
                text: 'Click!'
            }]
        }).show();
    }
}

export const startServer = async () => {
    const storedValue = configStore.get('server.port');
    if (typeof storedValue === 'number') port = storedValue;

    setServerStatus('starting');

    if (srv && !srv.server.listening) {
        srv.server.listen(port);
        setServerStatus('open');
        return showNotification();
    }

    const res = await startExpress(port)
        .catch(err => {
            return (err?.message || err) as string;
        });
    
    if (typeof res !== 'object') return res;
    
    setServerStatus('open');
    srv = res;

    showNotification();
}

export const startNgrok = async () => {
    if (
        context.serverStatus === 'closed' ||
        context.ngrokStatus === 'open'
    ) return;

    const res = await connectNgrok(srv.port);
    
    const err = (res as { error: string }).error;
    if (err) {
        setNgrokStatus('error');
        context.ngrokError = null;
        context.ngrokError = err;
        return { error: err };
    }

    setNgrokStatus('open');
    
    context.ngrok = res as unknown as ControlMe.NgrokResponse;
    return { url: context.ngrok.url };
}

export const stopNgrok = async () => {
    if (context.ngrokStatus === 'closed' || !context.ngrok) return;

    context.ngrok.disconnect();
    context.ngrok = null;

    setNgrokStatus('closed');
}

ipcMain.handle('writeToClipboard', async (e, str: string) => {
    clipboard.writeText(str);
});

ipcMain.handle('startServer', async (e, passedPort?: number) => {
    if (typeof passedPort === 'number') {
        port = passedPort;
        configStore.set('server.port', passedPort);
    }
    
    console.log(`starting server on :${port}`);
    return startServer();
});

ipcMain.handle('stopServer', async () => {
    console.log('closing server');
    srv.server.close();
    setServerStatus('closed');
});

ipcMain.handle('restartServer', async (e, passedPort?: number) => {
    srv.server.close();
    srv.express.purge('*');
    
    srv = null;
    
    setServerStatus('closed');
    await waitForSeconds(1.5);
    
    typeof passedPort === 'number' && (port = passedPort);
    return startServer();
});

ipcMain.handle('getServerStatus', async () => context.serverStatus);

ipcMain.handle('startNgrok', async () => startNgrok());
ipcMain.handle('stopNgrok', async () => stopNgrok());

ipcMain.handle('getNgrokStatus', async () => context.ngrokStatus);
ipcMain.handle('getNgrokURL', async () => context.ngrok?.url);
ipcMain.handle('getNgrokError', async () => context.ngrokError);

ipcMain.handle('getVersion', () => app.getVersion());

// Link sharing
ipcMain.handle(
    'generateShareLink',
    async (e, options: Omit<Auth.ShareLink, 'id'>) => {
        const id = randomUUID();
        const link: Auth.ShareLink = {
            id,
            ...options
        };

        authStore.set(`shareLinks.${id}`, link);
        context.main?.webContents.send('shareLinkAdded', link);

        return id;
    }
);

ipcMain.handle('deleteShareLink', async (e, id: string) => {
    authStore.delete(`shareLinks.${id}` as keyof Auth.AuthStore);
    context.main?.webContents.send('shareLinkRemoved', id);
    context.sockets?.forEach(socket => {
        if (socket.data.sid === id) socket.disconnect(true);
    });
});

ipcMain.handle('getShareLinks', async () => {
    return Object.values(authStore.store.shareLinks ?? {});
});

ipcMain.handle('openFileFolder', async () => {
    shell.openPath(context.defaultFileFolder);
});

ipcMain.on('popupFocus', e => {
    const popupWindow = context.popupWindows.find(w => w.webContents.id === e.sender.id);
    if (!popupWindow || context.focusedPopupWindowIds.has(popupWindow.webContents.id)) return;

    popupWindow.setIgnoreMouseEvents(false);
    popupWindow.focus();
    context.focusedPopupWindowIds.delete(popupWindow.webContents.id);
});

ipcMain.on('popupBlur', e => {
    const popupWindow = context.popupWindows.find(w => w.webContents.id === e.sender.id);
    if (!popupWindow || !context.focusedPopupWindowIds.has(popupWindow.webContents.id)) return;

    popupWindow.setIgnoreMouseEvents(true, { forward: true });
    popupWindow.blur();
    context.focusedPopupWindowIds.delete(popupWindow.webContents.id);
});

ipcMain.on('error', (e, err) => {
    console.log(`Error from window ID ${e.sender.id}`);
    console.error(err);
});