import openUrl from './openUrl';
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
    // Any filetype
    {
        name: 'uploadAnyFile',
        title: 'Upload any File',
        description: 'Allows uploading any file type',
        hidden: true,
        custom: true
    },
    {
        name: 'uploadMedia',
        title: 'Upload media Files',
        description: 'Allows uploading media files',
        hidden: true,
        custom: true
    },
    openUrl,
    imagePopup,
    writingPrompt,
    {
        name: 'nonClosablePopup',
        title: 'Non-closable Popup',
        description: 'If enabled, will allow popups to be impossible to close.',
        hidden: true
    }
].filter(func => {
    if (!func.supportedOs) return true;
    return ((func.supportedOs instanceof Array) ? func.supportedOs : [func.supportedOs])
        .some(os => process.platform === os)
});

export default functions;