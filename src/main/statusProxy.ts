import { ipcMain } from 'electron';
import context from '@main/context';

import Statuses = ControlMe.Statuses;

// Proxy that automatically returns and emits statuses
export default class StatusProxy extends Proxy<Partial<Statuses>> {
    constructor(channelSuffix: string, defaultStatuses: Partial<Statuses> = {}, emitToAll: boolean = false) {
        super({ ...defaultStatuses }, {
            get: <Key extends string & keyof Statuses>(obj, k: Key) => obj[k] as Statuses[Key],

            set: <Key extends string & keyof Statuses>(obj, k: Key, status: Statuses[Key]) => {
                const channel = `${k}${channelSuffix}`;

                obj[k] = status;
                context.mainWindow.webContents.send(channel, status);

                if (emitToAll) {
                    // Emit to all other windows
                    context.modules.popup.forEach(win => win.webContents.send(channel, status));
                    context.modules.backgroundTasks?.webContents.send(channel, status);
                }

                return true;
            }
        });

        for (const key in defaultStatuses) {
            ipcMain.handle(`${key}${channelSuffix}`, () => this[key]);
        }
    }
}