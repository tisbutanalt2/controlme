import { DangerLevel, FieldType, PopupType } from 'enum';
import context from 'ctx';

import pickRandom from '@utils/array/pickRandom';

interface Props {
    message?: string;
    prompt: string;
}

interface Options {
    maxCount?: number;
    maxTime?: number;
    blackScreen?: boolean;
    allowImpossible?: boolean;
}

let currentCount = 0;
const writingPrompt: ControlMe.Function<Props, Options> = {
    name: 'writingPrompt',
    dangerLevel: DangerLevel.Medium,

    title: 'Writing Prompt',
    description: 'Displays a prompt where text must be written to remove it',

    options: [
        {
            name: 'maxCount',
            type: FieldType.Number,
            label: 'Max prompt count',
            description: 'Sets a max limit on how many writing prompts can be displayed at once.',
            defaultValue: 1
        },

        {
            name: 'maxTime',
            type: FieldType.Number,
            label: 'Max popup time',
            description: 'Sets a max limit (in seconds) for how long a writing prompt can stay on screen.'
        },

        {
            name: 'blackScreen',
            type: FieldType.Boolean,
            label: 'Black Screen',
            description: 'Makes the entire screen black until the prompt is closed'
        },

        {
            name: 'allowImpossible',
            type: FieldType.Boolean,
            label: 'Allow potentially impossible prompt',
            description: 'Allows writing prompts to have any kind of text'
        }
    ],

    parameters: [
        {
            name: 'message',
            type: FieldType.String,
            label: 'Message',
            description: 'Optional message to display on top of the prompt'
        },

        {
            name: 'prompt',
            type: FieldType.String,
            label: 'Prompt',
            description: 'The prompt to display on screen',
            required: true
        }
    ],

    validateArgs(props, options) {
        if (!options.allowImpossible && !/^[a-z0-9\.,!\?\(\)="' ]*$/i.test(props.prompt))
            return 'This prompt is not allowed, as it may be impossible to write';

        return true;
    },

    handler(props, options) {
        if (options.maxCount && currentCount >= options.maxCount)
            return 'The max amount of writing prompts are already displayed';

        const popup: ControlMe.Popup = {
            type: PopupType.Writing,
            prompt: props.prompt,
            message: props.message,
            timeout: options.maxTime,
            blackScreen: options.blackScreen
        };

        if (!context.modules.popup.length) return 'No popup windows are available';
        if (!options.blackScreen) {
            pickRandom(context.modules.popup).webContents.send('popup.writing', popup);
        }

        // TODO more stuff here

        return true;
    }
}

export default writingPrompt;