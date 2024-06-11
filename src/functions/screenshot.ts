import { desktopCapturer, screen } from 'electron';

// TODO use browserwindow instead.
// Main process perhaps? Ref https://github.com/electron/electron/issues/22364 use constraints audio: false, video: mandatory: chromeMediaSource: 'desktop' chromeMediaSourceId: monitor
export default async function screenshot(monitor?: number) {
    if (typeof monitor !== 'number') monitor = 0;

    const monitors = screen.getAllDisplays();
    if (!monitors[monitor]) throw new Error(`Computer doesn't have screen ID ${monitor}`)

    console.log(`Screenshotting screen ${monitor}`);
    const displays = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: monitors[monitor].size.width, height: monitors[monitor].size.height } });

    return displays[monitor].thumbnail.toDataURL();
}