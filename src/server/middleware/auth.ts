import { Router } from 'express';
import decodeUserToken from '@utils/server/decodeUserToken';

const authMiddleware = Router();

authMiddleware.use((req, res, next) => {
    const jwt = req.cookies.jwt as string|undefined;
    if (!jwt) return next();

    const user = decodeUserToken(jwt);

    if (user)
        req.user = user
    else
        res.clearCookie('jwt', { httpOnly: true });

    next();
});

export default authMiddleware