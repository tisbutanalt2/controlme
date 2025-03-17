import { PromptCaller } from '@context/Prompt';

export const dangerousOption = (caller: PromptCaller, msgOrWarningLevel: ((string & {})|'medium'|'high') = 'medium') => caller({
    title: 'Dangerous option',
    message: msgOrWarningLevel === 'high'
        ?'This option is dangerous, and may cause damage to your computer. Are you sure you want to continue?'
        :msgOrWarningLevel === 'medium'
        ?'This option could be dangerous. Are you sure you want to enable it?'
    :(msgOrWarningLevel),

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