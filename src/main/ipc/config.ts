import { ipcMain } from 'electron';
import configStore from '@utils/store/config';

ipcMain.handle('config.get', (e, key?: string) => {
    if (!key) return configStore.store;
    return configStore.get(key);
});

ipcMain.handle('config.get', (e, key: string, value: any) => {
    configStore.set(key, value);
});

ipcMain.on('config.subscribeToChange', (e, key: string) => {
    configStore.onDidChange(key as keyof ControlMe.Settings, newValue => {
        e.sender.send('config.valueChange', key, newValue);
    });
});