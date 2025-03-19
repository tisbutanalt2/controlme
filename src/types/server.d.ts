declare global {
    namespace Express {
        interface Request {
            user: Auth.User;
            shareLink?: Auth.ShareLink;
            functionAccess: Set<string>;
        }
    }

    namespace ControlMe {
        interface Server {
            express: ReturnType<typeof import('express')>;
            http: import('http').Server;
            port: number;
            io: Socket.Server;
        }

        interface MinifiedWebData {
            /** User */
            u?: {
                /** Type */
                t: import('enum').UserType;
                /** Key */
                k: string;
                /** Display Name */
                d: string;
                /** Functions */
                f: Record<string, boolean>;

                /** Discord avatar */
                av?: string;

                /** Discord user ID */
                id?: string;

                /** Username */
                n?: string;
            }

            /** True if the used link is a signup link */
            su?: boolean;
            /** Share link */
            sid?: string;
        }
    }
}

export {};