declare global {
    namespace ControlMe {
        type ServerStatus = import('enum').ServerStatus;
        
        interface Statuses {
            server: import('enum').ServerStatus;
            ngrok: import('enum').ServerStatus;
        }

        interface Errors {
            server: string | undefined;
            ngrok: string | undefined;
        }

        interface Notification {
            id: string;

            imageSrc?: string;
            roundImage?: boolean;
            imageWidth?: number;
            imageHeight?: number;

            title?: string;
            message?: string;

            yesNo?: boolean;
            timeout?: number;

            noClose?: boolean;
        }
    }
}

export {};