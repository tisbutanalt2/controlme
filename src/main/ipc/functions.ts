import { ipcMain } from 'electron';
import functions from 'functions';

ipcMain.handle('functions.get', () => functions.map(
    ({ handler, validateArgs, ...f }) => f)
);