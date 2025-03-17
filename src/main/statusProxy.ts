import { ipcMain } from 'electron';
import context from '@main/context';

/* Proxy that automatically returns and emits statuses to the main window */
export default class StatusProxy<T> {
    constructor(channelSuffix: string, defaultStatuses: Partial<T> = {}, emitToAll: boolean = false) {
        const prox = new Proxy<Partial<T>>({ ...defaultStatuses }, {
            get: <Key extends string & keyof T>(obj, k: Key) => obj[k] as T[Key],
            
            set: <Key extends string & keyof T>(obj, k: Key, status: T[Key]) => {
                const channel = `${k}.${channelSuffix}`;
                
                obj[k] = status;
                context.mainWindow?.webContents.send(channel, status);
                
                if (emitToAll) {
                    // Emit to all other windows
                    context.modules.popup.forEach(win => win.webContents.send(channel, status));
                    context.modules.notification?.webContents.send(channel, status);
                    context.modules.backgroundTasks?.webContents.send(channel, status);
                }
                
                return true;
            }
        });
        
        for (const key in defaultStatuses) {
            ipcMain.handle(`${key}.${channelSuffix}`, () => prox[key]);
        }

        return prox;
    }
}