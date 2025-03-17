import { ipcMain } from 'electron';

import context from 'ctx';
import configStore from '@stores/config';
import authStore from '@stores/auth';

ipcMain.handle('config.get', (_e, key?: string) => {
    if (!key) return configStore.store;
    return configStore.get(key);
});

ipcMain.on('config.set', (_e, key: string, value: unknown) => {
    configStore.set(key, value);
});

ipcMain.on('config.subcribeToChange', (e, key: string) => {
    configStore.onDidChange(key as keyof ControlMe.Settings, v => {
        e.sender.send('config.valueChange', key, v);
    });
});

ipcMain.handle('users.disconnect', (_e, socketId: string) => {
    const socket = context.sockets.find(s => s.id === socketId);
    if (!socket) return false;

    socket.disconnect();
    return true;
});

ipcMain.handle('users.delete', (_e, key: string) => {
    authStore.delete(`users.${key}` as keyof Auth.Store);

    // Check if said user is connected
    const socket = context.sockets.find(s => s.data.user?._key === key);
    if (!socket) return false;

    socket.disconnect();
    return true;
});

ipcMain.handle('users.deleteAll', () => {
    authStore.delete('users');
    if (!context.sockets.length) return false;

    context.sockets.forEach(socket => socket.disconnect());
    return true;
});