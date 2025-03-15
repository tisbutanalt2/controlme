import authStore, { secret } from '@utils/store/auth';
import jsonwebtoken from 'jsonwebtoken';

export default function decodeUserToken(jwt?: string): Auth.User|Auth.DiscordUser|null {
    if (!jwt) return null;

    try {
        const decoded = jsonwebtoken.verify(jwt, secret) as Auth.JWT|Auth.DiscordJWT;
        const storedUser = (decoded as Auth.DiscordJWT).userId
            ? authStore.get(`discordUsers.${(decoded as Auth.DiscordJWT).userId}`) as Auth.DiscordUser
            : authStore.get(`users.${(decoded as Auth.JWT).username}`) as Auth.User;

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