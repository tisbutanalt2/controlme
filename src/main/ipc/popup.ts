import { ipcMain } from 'electron';
import context from 'ctx';

import configStore from '@stores/config';
import pickRandom from '@utils/array/pickRandom';

import { randomUUID } from 'crypto';
import { PopupType } from 'enum';
import { pathToFileURL } from 'url';
import { join } from 'path';

export const displayPopup = (popup: ControlMe.Popup, popupType: string, sendToSub: boolean = false) => {
    if (!context.modules.popup.length) return Promise.resolve<string>('No popup windows are available');
    const id = popup.id ?? randomUUID();

    if (popup.type === PopupType.Image || popup.type === PopupType.Video || popup.type === PopupType.Audio) {
        if (!popup.folderId || !popup.src)
            throw new Error('src or folderId is missing');

        const folders = configStore.get('folders');

        const folder = folders?.find(f => f.id === popup.folderId);
        if (!folder) throw new Error('Folder not found');

        popup.fullPath = pathToFileURL(
            join(folder.path, popup.src)
        ).href;
    }

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