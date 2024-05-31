import { join } from 'path';
import context from '@main/context';

export default async function setBackground(src: string, options?: any) {
    // Fuck you TSC
    const wp = eval("import('wallpaper')") as Promise<typeof import('wallpaper')>;
    await (await wp).setWallpaper(
        join(context.mediaFolder, src),
        options ?? {
            scale: 'fit',
            screen: 'all'
        }
    );
    return true;
}