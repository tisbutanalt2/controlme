import { ipcMain } from 'electron';
import configStore from '@stores/config';

ipcMain.handle('config.get', (_e, key?: string) => {
    if (!key) return configStore.store;
    return configStore.get(key);
});

ipcMain.on('config.set', (_e, key: string, value: unknown) => {
    configStore.set(key, value);
});

ipcMain.on('config.delete', (_e, key: string) => {
    configStore.delete(key as keyof ControlMe.Settings);
});

const subscribedKeys = new Set<string>();
ipcMain.on('config.subcribeToChange', (e, key: string) => {
    if (subscribedKeys.has(key)) return;
    
    configStore.onDidChange(key as keyof ControlMe.Settings, v => {
        e.sender.send('config.valueChange', key, v);
    });
    
    subscribedKeys.add(key);
});