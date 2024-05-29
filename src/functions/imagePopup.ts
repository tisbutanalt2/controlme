import { ImagePopupProps } from '@/web/modules/Popup/ImagePopup';
import context from '@/context';
import pickRandom from '@utils/array/pickRandom';
import { randomUUID } from 'crypto';
import { join } from 'path';

export default async function imagePopup(props: ImagePopupProps) {
    const location = join(context.defaultMediaFolder, props.src);
    console.log(location);

    const popupWindow = pickRandom(context.popupWindows);
    console.log(`Sending popup to window ID ${popupWindow?.webContents.id}`);

    popupWindow?.webContents.send('popup', {
        id: randomUUID(),
        src: location
    } as ImagePopupProps);
}