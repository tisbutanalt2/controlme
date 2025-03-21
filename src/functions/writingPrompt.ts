import { DangerLevel, FieldType, PopupType } from 'enum';
import context from 'ctx';

import { displayPopup } from '@ipc/popup';

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
    description: 'Displays a prompt where text must be written to remove it.',

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
            description: 'Makes the entire screen black until the prompt is closed.'
        },

        {
            name: 'allowImpossible',
            type: FieldType.Boolean,
            label: 'Allow potentially impossible prompt',
            description: 'Allows writing prompts to have any kind of text.'
        }
    ],

    parameters: [
        {
            name: 'message',
            type: FieldType.String,
            label: 'Message',
            description: 'Optional message to display alongside the prompt.'
        },

        {
            name: 'prompt',
            type: FieldType.String,
            label: 'Prompt',
            description: 'The prompt to display on screen.',
            required: true,
            multiline: true,
            sx: { width: '100%' }
        }
    ],

    validateArgs(props, options) {
        if (!options.allowImpossible) {
            if (!/^[a-z0-9\.,!\?\(\)="'\/#@ \n]*$/im.test(props.prompt))
                return 'This prompt is not allowed, as it may be impossible to write';

            const linebreakCount = Array.from(props.prompt.matchAll(/\n/g))?.length;
            if (linebreakCount > 20)
                return 'This prompt is not allowed, as it has too many line breaks';
        }

        return true;
    },

    async handler(props, options) {
        if (options.maxCount && currentCount >= options.maxCount)
            return 'The max amount of writing prompts are already displayed';

        const popup: ControlMe.Popup = {
            type: PopupType.Writing,
            prompt: props.prompt,
            message: props.message,
            timeout: options.maxTime,
            blackScreen: options.blackScreen
        };

        const res = await displayPopup(popup, 'writing', Boolean(options.blackScreen));
        return res;
    }
}

export default writingPrompt;