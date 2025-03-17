import { screen } from 'electron';
import context from 'ctx';

/**
 * Enables passable mouse events
 * @param win Browser window
 * @param optimize Whether to optimize the interval by comparing the current mouse position to the last checked position. Use if the window has no moving elements.
 * @returns NodeJS interval ID
 */
export default async function transparentPassthrough(win: Electron.BrowserWindow, optimize: boolean = true) {
    // https://github.com/electron/electron/issues/1335#issuecomment-1585787243
    const updateIgnore = async (x: number, y: number) => {
        const img = await win.webContents.capturePage({
            x, y, width: 1, height: 1
        });
        
        const buffer = img.getBitmap();

        win.setIgnoreMouseEvents(!buffer[3])
    }

    let devtoolsOpen = false;
    let lastX: number = 0, lastY: number = 0;

    const pointInterval = setInterval(() => {
        if (context.mainWindowMoving) return win.setIgnoreMouseEvents(true);
        if (devtoolsOpen) return win.setIgnoreMouseEvents(false);

        const point = screen.getCursorScreenPoint();
        const [x, y] = win.getPosition();
        
        const xPoint = point.x - x;
        const yPoint = point.y - y;
        if (xPoint === lastX && yPoint === lastY) return;

        lastX = xPoint;
        lastY = yPoint;

        const [w, h] = win.getSize();

        if (
            point.x > x && point.x < x + w &&
            point.y > y && point.y < y + h
        ) updateIgnore(xPoint, yPoint);
    }, 50);

    const onDevtoolsOpened = () => devtoolsOpen = true;
    const onDevtoolsClosed = () => devtoolsOpen = false;

    win.webContents.on('devtools-opened', onDevtoolsOpened);
    win.webContents.on('devtools-closed', onDevtoolsClosed);

    const closeListener = () => {
        clearInterval(pointInterval);
    
        win.webContents?.off('devtools-opened', onDevtoolsOpened);
        win.webContents?.off('devtools-closed', onDevtoolsClosed);
    }

    win.on('close', () => {
        closeListener();
        win.off('close', closeListener);
    });

    return () => {
        clearInterval(pointInterval);
        win.off('close', closeListener);
        win.webContents?.off('devtools-opened', onDevtoolsOpened);
        win.webContents?.off('devtools-closed', onDevtoolsClosed);
    };
}