import jsonwebtoken from 'jsonwebtoken';
import context from 'ctx';

import { UserType } from 'enum';
import authStore from '@stores/auth';

export default function decodeUserToken(jwt: string): Auth.User|null {
    try {
        const decoded = jsonwebtoken.verify(jwt, context.secret) as Auth.JWT;

        if (decoded.t === UserType.Access) return {
            type: UserType.Access,
            displayName: decoded.dn
        }

        const storedUser = authStore.get(`users.${
            decoded.t === UserType.Login
                ? decoded.usr
                : decoded.id
        }`) as Auth.User & { type: UserType.Login|UserType.Discord };
        
        const ts = Math.floor(Date.now() / 1000);

        if (
            !storedUser ||
            (decoded.exp <= ts) ||
            (decoded.iat !== storedUser.lastLogin) ||
            (storedUser.lastLogout && (storedUser.lastLogout > decoded.iat))
        ) return null;

        return storedUser;
    } catch {
        return null;
    }
}