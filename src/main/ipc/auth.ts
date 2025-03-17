import { ipcMain } from 'electron';
import context from 'ctx';
import authStore from '@stores/auth';

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