import { RequestHandler } from 'express';

import decodeUserToken from './decodeUserToken';

export default function requireLoggedIn(): RequestHandler {
    return (req, res, next) => {
        const tokenMatch = req.headers.authorization?.match(/^Bearer (.*)$/i);
        if (!tokenMatch) return res.status(403).send('You must be logged in');

        const user = decodeUserToken(tokenMatch[1]);
        if (!user) return res.status(403).send('Invalid JWT');

        req.user = user;
        next();
    }
}