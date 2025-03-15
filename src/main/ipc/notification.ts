import context from '@main/context';
import { ipcMain } from 'electron';

ipcMain.on('notificationFocus', () => {
    const win = context.modules.notification;

    win.setIgnoreMouseEvents(false);
    win.focus();
});

ipcMain.on('notificationBlur', () => {
    const win = context.modules.notification;

    win.setIgnoreMouseEvents(true, { forward: true });
    win.blur();
});