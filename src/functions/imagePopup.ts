import { ImagePopupProps } from '@/web/modules/Popup/ImagePopup';
import context from '@main/context';
import pickRandom from '@utils/array/pickRandom';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { PopupPropsBase } from '@/web/modules/Popup/Base';

export default async function imagePopup(props: ImagePopupProps) {
    const location = join(context.mediaFolder, props.src);

    const popupWindow = pickRandom(context.modules.popup);
    console.log(`Sending popup to window ID ${popupWindow?.webContents.id}`);

    popupWindow?.webContents.send('popup', {
        id: randomUUID(),
        type: 'image',
        src: location
    } as PopupPropsBase);
}