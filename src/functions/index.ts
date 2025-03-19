import imagePopup from './imagePopup';

// Array of functions and "dummy" functions for permissions
const functions: Array<ControlMe.Function> = [
    {
        name: 'chat',
        title: 'Chat',
        description: 'Allows sending messages to the chat.',
        hidden: true
    },
    imagePopup,
    {
        name: 'nonClosablePopup',
        title: 'Non-closable Popup',
        description: 'If enabled, will allow popups to be impossible to close.',
        hidden: true
    },
];

export default functions;