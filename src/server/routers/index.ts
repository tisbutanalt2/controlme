import type { Router } from 'express';

// Import routers
import web from './web';
import authRouter from './auth';
import discordRouter from './discord';

const routers: Array<Router> = [
    web,
    authRouter,
    discordRouter
];

export default routers;