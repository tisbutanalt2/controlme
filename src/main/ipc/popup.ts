import context from '@main/context';
import { ipcMain } from 'electron';

const windowFromEvent = (e: Electron.IpcMainEvent) =>
    context.modules.popup.find(w => w.webContents.id === e.sender.id)
;

ipcMain.on('popupFocus', e => {
    const win = windowFromEvent(e);
    if (!win) return;

    win.setIgnoreMouseEvents(false);
    win.focus();
});

ipcMain.on('popupBlur', e => {
    const win = windowFromEvent(e);
    if (!win) return;

    win.setIgnoreMouseEvents(true, { forward: true });
    win.blur();
});