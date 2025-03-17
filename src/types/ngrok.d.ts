declare global {
    namespace ControlMe {
        interface NgrokFallback {
            domain?: string;
            authToken: string;
        }

        interface Ngrok {
            url: string;
            tunnel: import('@ngrok/ngrok').Listener;
        }
    }
}

export {};