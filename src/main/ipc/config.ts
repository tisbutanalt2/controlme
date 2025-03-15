import { ipcMain, shell } from 'electron';
import configStore from '@utils/store/config';
import authStore from '@utils/store/auth';

import context from '@main/context';

ipcMain.handle('config.get', (e, key?: string) => {
    if (!key) return configStore.store;
    return configStore.get(key);
});

ipcMain.handle('config.set', (e, key: string, value: any) => {
    configStore.set(key, value);
});

ipcMain.on('config.subscribeToChange', (e, key: string) => {
    configStore.onDidChange(key as keyof ControlMe.Settings, newValue => {
        e.sender.send('config.valueChange', key, newValue);
    });
});

ipcMain.on('purgeUsers', () => {
    authStore.delete('discordUsers');

    const users = authStore.get('users') as Record<string, Auth.User>|undefined;
    if (users) {
        Object.keys(users).forEach(user => {
            authStore.delete(`users.${users[user].username}.approved` as keyof Auth.AuthStore);
        });
    }

    context.sockets.forEach(socket => socket.disconnect());
});

ipcMain.on('deleteUsers', () => {
    authStore.delete('users');
});

ipcMain.on('openFileFolder', () => {
    shell.openPath(context.fileFolder);
})