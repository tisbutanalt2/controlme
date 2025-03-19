import { UserType } from 'enum';

export default function minifyUser(user: Auth.User): ControlMe.MinifiedWebData['u'] {
    const f: Record<string, boolean> = {};
    user.functionOverrides.forEach(override => f[override.name] = override.allow);

    const d: ControlMe.MinifiedWebData['u'] = {
        t: user.type,
        k: user._key,
        d: user.displayName,
        f
    };

    switch(user.type) {
        case UserType.Login:
            d.n = user.username;
            break;
        case UserType.Discord:
            d.n = user.username;
            d.av = user.avatar;
            d.id = user.userId;
    }

    return d;
}