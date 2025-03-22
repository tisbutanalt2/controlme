import type { Router } from 'express';

// Import routers
import web from './web';
import authRouter from './auth';
import discordRouter from './discord';
import functionRouter from './function';
import fileRouter from './files';

const routers: Array<Router> = [
    web,
    authRouter,
    discordRouter,
    functionRouter,
    fileRouter
];

export default routers;