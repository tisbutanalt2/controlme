import context from 'ctx';
import { DangerLevel, FieldType } from 'enum';

import pickRandom from '@utils/array/pickRandom';
import { globPatterns } from 'const';

const imagePopup: ControlMe.Function = {
    name: 'imagePopup',
    dangerLevel: DangerLevel.Low,

    title: 'Image Popup',
    description: 'Displays image popups on any of your screens.',

    options: [
        {
            name: 'maxCount',
            type: FieldType.Number,
            label: 'Max popup count',
            description: 'Sets a max limit on how many image popups can be displayed at once.',
            defaultValue: 20
        },

        {
            name: 'maxTime',
            type: FieldType.Number,
            label: 'Max popup time',
            description: 'Sets a max limit (in seconds) for how long an image popup can stay on screen.',
            defaultValue: 30
        }
    ],

    parameters: [
        {
            name: 'src',
            type: FieldType.File,
            required: true,
            glob: globPatterns.image,
            label: 'Image'
        },

        {
            name: 'nonClosable',
            type: FieldType.Boolean,
            requiredPermission: 'nonClosablePopup',
            label: 'Non-closable',
            description: 'Prevents the popup from being closed.'
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