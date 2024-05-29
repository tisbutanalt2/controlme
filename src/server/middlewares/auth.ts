import { Router } from 'express';
import decodeUserToken from '@utils/server/decodeUserToken';

const authMiddleware = Router();

authMiddleware.use((req, res, next) => {
    const tokenMatch = req.headers.authorization?.match(/^Bearer (.*)$/);
    if (!tokenMatch) return next();

    const user = decodeUserToken(tokenMatch[1]);
    user && (req.user = user);

    next();
})

export default authMiddleware;