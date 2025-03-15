declare global {
    namespace ControlMe.Web {
        interface AccessSetup {
            displayName: string;
            functions?: Settings['functions'];
            user?: Auth.ReducedUser;
            shareLink?: Auth.ReducedShareLink;
            jwt?: string;
            discordJwt?: string;
            discordAccessId?: string;
        }

        interface Notification {
            id: string;
            
            imageSrc?: string;
            title?: string;
            description?: string;

            yesNo?: boolean;
            timeout?: number;

            noClose?: boolean;
        }
    }
}

export {}