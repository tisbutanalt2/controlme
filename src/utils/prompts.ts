import { PromptCaller } from '@context/Prompt';

export const dangerousOption = (caller: PromptCaller, messageOrVeryDangerous?: string|boolean) => caller({
    title: 'Dangerous option',
    message: (typeof messageOrVeryDangerous === 'string')
        ? messageOrVeryDangerous
        : (messageOrVeryDangerous
            ? 'This option is dangerous, and may cause damage to your computer. Are you sure you want to enable it?'
            : 'This option could be dangerous. Are you sure you want to enable it?'
        ),
    actions: [
        {
            name: 'cancel',
            label: 'Cancel'
        },

        {
            name: 'confirm',
            label: 'Ok'
        }
    ]
}).then(res => res?.action === 'confirm');