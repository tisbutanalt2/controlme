import { UserType } from 'enum';

export default function userLabel(user: Auth.User) {
    return user.type === UserType.Access
            ? `Access: ${user.displayName} (${user._key})` :
        user.type === UserType.Discord
            ? `Discord: ${user.displayName} (${user.userId})` :
        `Login: ${user.displayName}${user.username !== user.displayName ? ` (${user.username})` : ''}`;
}