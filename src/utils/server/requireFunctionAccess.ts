import { RequestHandler } from 'express';

export default function requireFunctionAccess(name: keyof ControlMe.Settings['functions']): RequestHandler {
    return (req, res, next) => {
        if (!req.functionAccess?.[name]) return res.status(400).send('No access');
        next();
    }
}