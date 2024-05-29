import authStore, { secret } from '@utils/store/auth';
import jsonwebtoken from 'jsonwebtoken';

export default function decodeUserToken(jwt?: string): Auth.User|null {
    if (!jwt) return null;

    try {
        const decoded = jsonwebtoken.verify(jwt, secret) as Auth.JWT;
        const storedUser = authStore.get(`users.${decoded.username}`) as Auth.User;

        if (
            !storedUser ||
            (decoded.timestamp !== storedUser.lastLogin) ||
            (storedUser.lastLogout && (storedUser.lastLogout > decoded.timestamp))
        ) return null;

        return storedUser;
    } catch {
        return null;
    }
}