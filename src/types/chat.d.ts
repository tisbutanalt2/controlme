declare global {
    namespace ControlMe.Chat {
        type Message = {
            id: string;
            content: string;
            isHost: boolean;
        } & ({
            isHost: true;
            user: Auth.User;
        } | { isHost: false });

        interface Store {
            messages: Array<Message>;
        }
    }
}

export {};