declare global {
    namespace Auth {
        interface AccessOverrides {
            functions?: Partial<ControlMe.Settings['functions']>;
            files?: Partial<ControlMe.Settings['files']>;
        }

        interface User {
            username: string;

            /** Hashed with bcrypt */
            password: string;

            displayName: string;

            /** Used for JWT validation */
            lastLogin?: number;
            lastLogout?: number;

            /** Optional access overrides */
            accessOverrides?: AccessOverrides;
        }

        type ReducedUser = Pick<User, 'username'|'displayName'>;

        interface ShareLink {
            id: string;

            /** Max amount of times the link can be used */
            maxUses?: number;
            currentUses?: number;
    
            /** Expiration timestamp */
            expiresAt?: string;
    
            /** Whether it's an access link or a signup link */
            type: 'access'|'signup';

            /** Optional access overrides */
            accessOverrides?: AccessOverrides;
        }

        type ReducedShareLink = Pick<ShareLink, 'id'|'type'> & {
            functions: ControlMe.Settings['functions'];
        }

        interface JWT {
            username: string;
            timestamp: number;
        }

        interface AuthStore {
            secret?: string;
            shareLinks?: Record<string, ShareLink>;
            users?: Record<string, User>;
        }
    }
}

export {}