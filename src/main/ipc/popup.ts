import { ipcMain } from 'electron';
import context from 'ctx';

import pickRandom from '@utils/array/pickRandom';
import { randomUUID } from 'crypto';

export const displayPopup = (popup: ControlMe.Popup, popupType: string, sendToSub: boolean = false) => {
    if (!context.modules.popup.length) return Promise.resolve<string>('No popup windows are available');
    const id = popup.id ?? randomUUID();

    const target = pickRandom(context.modules.popup);
    target.webContents.send('popup', {
        id,
        ...popup
    } as ControlMe.Popup);

    const subs = context.modules.popup.filter(win => win !== target);
    if (sendToSub) {
        subs.forEach(sub => sub.webContents.send('popup', {
            id,
            ...popup,
            isSub: true
        } as ControlMe.Popup))
    }

    return new Promise<true|string>(res => {
        const listener = (e: Electron.IpcMainEvent, closedId: string) => {
            if (closedId !== id || e.sender !== target.webContents) return;
            
            if (sendToSub)
                subs.forEach(sub => sub.webContents.send('popup.closed', id, popupType));

            res(true);
        }
    
        ipcMain.once(`popup.${popupType}.closed`, listener);
        setTimeout(() => {
            ipcMain.off(`popup.${popupType}.closed`, listener);
            res('Popup timed out');
        }, 300_000);
    });
}