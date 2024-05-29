declare global {
    namespace Chat {
        interface Message {
            id: string;
            author: { type: 'client'|'user'|'access' } & (
                { type: 'user', username: string }|
                { type: 'access', shareLink: string }|
                {}
            );
            content: string;
        }
    }
}

export {};