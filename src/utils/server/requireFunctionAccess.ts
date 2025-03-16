import { type RequestHandler } from 'express';

export default function requireFunctionAccess(name: string): RequestHandler {
    return (req, res, next) => {
        if (!req.functionAccess?.has(name))
            return res.status(400).send('You do not have access to use this function')

        next();
    }
}