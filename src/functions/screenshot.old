import screenshotDesktop, { listDisplays } from 'screenshot-desktop';

export default async function screenshot(screen?: number) {
    const displays = await listDisplays();
    //console.log(displays);

    if (typeof screen === 'number' && !displays[screen]) throw new Error(`Computer doesn't have screen ID ${screen}`);

    console.log(`Screenshotting screen ${screen}`);

    const data = await screenshotDesktop({ screen: typeof screen === 'number'? displays[screen]?.id: undefined, format: 'png' });
    return `data:image/png;base64,${data.toString('base64')}`;
}