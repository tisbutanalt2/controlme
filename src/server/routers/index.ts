import type { Router } from 'express';

// Import routers
import web from './web';
import authRouter from './auth';

const routers: Array<Router> = [
    web,
    authRouter
];

export default routers;