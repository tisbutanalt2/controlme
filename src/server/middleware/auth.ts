import { Router } from 'express';
import decodeUserToken from '@utils/server/decodeUserToken';

const authMiddleware = Router();

authMiddleware.use((req, res, next) => {
    let jwt = req.cookies.jwt as string|undefined;
    if (!jwt) {
        const jwtMatch = String(req.headers.authorization ?? req.headers.Authorization).match(/^bearer (.+)$/i);
        if (jwtMatch)
            jwt = jwtMatch[1];
    }
    
    if (!jwt) return next();

    const user = decodeUserToken(jwt);

    if (user)
        req.user = user
    else
        res.clearCookie('jwt', { httpOnly: true });

    next();
});

export default authMiddleware