declare global {
    namespace ControlMe {
        type ChatMessage = {
            id: string;
            content: string;
            isHost: boolean;
        } & ({
            isHost: true;
            user: Auth.User;
        } | { isHost: false });
    }
}

export {};