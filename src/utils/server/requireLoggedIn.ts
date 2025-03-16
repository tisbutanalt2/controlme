import { RequestHandler } from 'express';
import configStore from '@stores/config';
import { UserType } from 'enum';

export default function requireLoggedIn(
    respectDisableAuth: boolean = false,
    allowedTypes: boolean|UserType|Array<UserType> = [UserType.Login, UserType.Discord]
): RequestHandler {
    // If allowedTypes is a boolean, allow all types
    if (typeof allowedTypes === 'boolean') allowedTypes = [
        UserType.Login,
        UserType.Access,
        UserType.Discord
    ];

    else if (
        !(allowedTypes instanceof Array)
    ) allowedTypes = [allowedTypes];

    const disableAuth = configStore.get('security.disableAuth') as boolean;

    return (req, res, next) => {
        if (!req.user) {
            if (respectDisableAuth && disableAuth) return next();
            return res.status(403).send('You must be logged in to access this resource');
        }

        if (!allowedTypes.includes(req.user.type)) {
            if (respectDisableAuth && disableAuth) return next();
            return res.status(403).send('You must be logged in to access this resource');
        }

        next();
    }
}