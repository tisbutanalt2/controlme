declare global {
    namespace ControlMe {
        type ServerStatus = import('enum').ServerStatus;
        
        interface Statuses {
            server: import('enum').ServerStatus;
            ngrok: import('enum').ServerStatus;
        }

        interface Errors {
            server: string|undefined;
            ngrok: string|undefined;
        }
    }
}

export {};