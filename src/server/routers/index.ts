import type { Router } from 'express';

// Import routers
import web from './web';
import authRouter from './auth';
import discordRouter from './discord';
import functionRouter from './function';

const routers: Array<Router> = [
    web,
    authRouter,
    discordRouter,
    functionRouter
];

export default routers;