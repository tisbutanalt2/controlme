import { ipcRenderer } from 'electron';

const chatFunctions = {
    onChatMessage: (handler: (msg: ControlMe.Chat.Message) => void) => {
        const listener = (_e, msg: ControlMe.Chat.Message) => {
            handler(msg);
        }

        ipcRenderer.on('chat.message', listener);
        return () => ipcRenderer.off('chat.message', listener);
    },

    sendChatMessage: (msg: Omit<ControlMe.Chat.Message, 'id'> & { isHost: true }) =>
        ipcRenderer.invoke('chat.send', msg) as Promise<string>
};

export default chatFunctions;