declare global {
    namespace ControlMe.Web {
        interface AccessSetup {
            displayName: string;
            functions?: Settings['functions'];
            user?: Auth.ReducedUser;
            shareLink?: Auth.ReducedShareLink;
            jwt?: string;
        }
    }
}

export {}