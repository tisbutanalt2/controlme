declare global {
    namespace Auth {
        type User = {
            /** Will be either the username, Discord user ID, or a randomly generated UUID */
            _key: string;
            type: import('enum').UserType;
            functionOverrides?: ControlMe.FunctionOverrides;

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
            type: import('enum').UserType.Login | import('enum').UserType.Discord;

            /** Used for JWT validation */
            lastLogin?: number;
            lastLogout?: number;
        } | {
            type: import('enum').UserType.Access;
        });

        interface ApprovedUser {
            _key: string;
            expiration?: number;
        }

        interface Store {
            secret: string;

            users: Record<string, User>;
            approvedUsers: Record<string, ApprovedUser>;

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
            
            /** Share ID */
            sid: string;

            /** Random key */
            k: string;

            /** Display name */
            dn: string;
        } | {
            t: import('enum').UserType.Discord
            id: string;
        });

        interface DiscordUser {
            id: string;
            username: string;

            global_name: string;
            avatar: string;
        }
    }
}

export {};