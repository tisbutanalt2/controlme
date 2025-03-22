import context from 'ctx';
import { DangerLevel, FieldType, FileType, FolderType, PopupType } from 'enum';

import pickRandom from '@utils/array/pickRandom';
import { displayPopup } from '@ipc/popup';

let currentCount = 0;
const imagePopup: ControlMe.Function<
    { src: ControlMe.TargetFile; nonClosable?: boolean },
    { maxCount?: number; maxTime?: number }
> = {
    name: 'imagePopup',
    dangerLevel: DangerLevel.Low,

    title: 'Image Popup',
    description: 'Displays image popups on any of your screens.',
    userDescription: 'Display an image popup on the screen.',

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
            fileType: FileType.Image,
            folderType: [FolderType.Image, FolderType.Media],
            label: 'Image'
        },

        {
            name: 'nonClosable',
            type: FieldType.Boolean,
            requiredPermission: 'nonClosablePopup',
            label: 'Non-closable',
            description: 'Prevents the popup from being closed.',
            defaultValue: false
        }
    ],

    async handler(props, options) {
        if (options.maxCount && currentCount >= options.maxCount)
            return 'The max amount of writing prompts are already displayed';

        const popup: ControlMe.Popup = {
            type: PopupType.Image,
            src: props.src.file,
            closable: !props.nonClosable,
            folderId: props.src.folder,
            timeout: options.maxTime
        };

        const res = await displayPopup(popup, 'image');
        return res;
    }
};

export default imagePopup;