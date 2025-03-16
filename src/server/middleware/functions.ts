import { Router } from 'express';
import getFunctionAccess from '@utils/server/getFunctionAccess';

const functionMiddleware = Router();

functionMiddleware.use((req, _res, next) => {
    if (!req.user) {
        req.functionAccess = new Set<string>();
        return next();
    }

    req.functionAccess = getFunctionAccess(req.user.functionOverrides);
    next();
})

export default functionMiddleware;