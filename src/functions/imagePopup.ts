import context from 'ctx';
import { DangerLevel, FieldType } from 'enum';

import pickRandom from '@utils/array/pickRandom';

const imagePopup: ControlMe.Function = {
    name: 'imagePopup',
    dangerLevel: DangerLevel.Medium,

    title: 'Image Popup',
    description: 'Displays image popups on any of your screens',

    options: [
        {
            name: 'maxTime',
            type: FieldType.Number,
            label: 'Max popup time',
            description: 'Sets a max limit (in seconds) for how long a popup can stay on screen'
        }
    ],

    parameters: [
        {
            name: 'src',
            type: FieldType.String,
            required: true
        },

        {
            name: 'clickable',
            type: FieldType.Boolean
        }
    ],

    handler: (props: ControlMe.Popup & { type: import('enum').PopupType.Image }) => {
        if (!context.modules.popup?.length) return 'No popup windows are available';
        const popupWindow = pickRandom(context.modules.popup);

        popupWindow.webContents.send('popup', props);
        return true;
    }
};

export default imagePopup;