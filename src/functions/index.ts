import imagePopup from './imagePopup';
import writingPrompt from './writingPrompt';

// Array of functions and "dummy" functions for permissions
const functions: Array<ControlMe.Function<unknown, unknown>> = [
    {
        name: 'chat',
        title: 'Chat',
        description: 'Allows sending messages to the chat.',
        hidden: true,
        custom: true
    },
    imagePopup,
    writingPrompt,
    {
        name: 'nonClosablePopup',
        title: 'Non-closable Popup',
        description: 'If enabled, will allow popups to be impossible to close.',
        hidden: true
    },
];

export default functions;