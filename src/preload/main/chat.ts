import { ipcRenderer } from 'electron';

const chatFunctions = {
    onChatMessage: (handler: (msg: ControlMe.ChatMessage) => void) => {
        const listener = (_e, msg: ControlMe.ChatMessage) => {
            handler(msg);
        }

        ipcRenderer.on('chat.message', listener);
        return () => ipcRenderer.off('chat.message', listener);
    },

    sendChatMessage: (msg: Omit<ControlMe.ChatMessage, 'id'> & { isHost: true }) =>
        ipcRenderer.invoke('chat.send', msg) as Promise<string>
};

export default chatFunctions;