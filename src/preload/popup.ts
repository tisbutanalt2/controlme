import { contextBridge, ipcRenderer } from 'electron';
import baseContext from './base';

const context = {
    ...baseContext,

    onPopup: (cb: (popup: ControlMe.Popup) => void) => {
        const listener = (_e, popup: ControlMe.Popup) => {
            cb(popup);
        }

        ipcRenderer.on('popup', listener);
        return () => ipcRenderer.off('popup', listener);
    },

    onPopupClosed: (cb: (id: string, popupType: string) => void) => {
        const listener = (_e, id: string, popupType: string) => {
            cb(id, popupType);
        }

        ipcRenderer.on('popup.closed', listener);
        return () => ipcRenderer.off('popup.closed', listener);
    },

    popupClosed: (id: string, popupType: string) => ipcRenderer.send(`popup.${popupType}.closed`, id)
};

declare global {
    interface Window {
        ipcPopup: typeof context;
    }
}

contextBridge.exposeInMainWorld('ipcPopup', context);
export {};