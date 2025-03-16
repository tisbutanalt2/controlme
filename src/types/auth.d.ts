declare global {
    namespace Auth {
        type User = {
            type: import('enum').UserType;
            functionOverrides?: Array<ControlMe.FunctionOverride>;

            /** The user's displayname in the app */
            displayName: string;
        } & ({
                type: import('enum').UserType.Login;
                username: string;
                password: string;
            } | {
                type: import('enum').UserType.Discord;
                userId: string;
                username: string;
                avatar: string;
            } | {
                type: import('enum').UserType.Access;
            }
        ) & ({
            type: import('enum').UserType.Login|import('enum').UserType.Discord;
            _key: string;

            /** Used for JWT validation */
            lastLogin?: number;
            lastLogout?: number;
        } | {
            type: import('enum').UserType.Access;
        })

        interface Store {
            secret: string;

            users: Record<string, User>;
            shareLinks: Record<string, ShareLink>;
        }

        type JWT = {
            /** JWT type */
            t: import('enum').UserType;

            /** Issued at timestamp (unix) */
            iat: number;

            /** Expires at (unix) */
            exp: number;
        } & ({
            t: import('enum').UserType.Login;
            usr: string;
        } | {
            t: import('enum').UserType.Access;

            /** Display name */
            dn: string;
        } | {
            t: import('enum').UserType.Discord
            id: string;
        });
    }
}

export {};