import { Router } from 'express';

import authMiddleware from './auth';
import functionMiddleware from './functions';
import shareMiddleware from './share';

const middleware = Router();

middleware.use(authMiddleware);
middleware.use(functionMiddleware);
middleware.use(shareMiddleware);

export default middleware;