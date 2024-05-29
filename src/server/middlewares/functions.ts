import { Router } from 'express';
import getFunctionAccess from '@utils/server/getFunctionAccess';

const functionMiddleware = Router();

functionMiddleware.use((req, res, next) => {
    const access = getFunctionAccess(
        req.user?.accessOverrides || req.headers.sid as string,
        true
    );

    req.functionAccess = access;
    next();
})

export default functionMiddleware;