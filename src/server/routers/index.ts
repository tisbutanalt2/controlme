import type { Router } from 'express';

// Import routers
import web from './web';

const routers: Array<Router> = [
    web
];

export default routers;