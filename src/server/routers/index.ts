import { Router } from 'express';

// Import routers
import web from './web';
import auth from './auth';
import upload from './upload';
import hello from './hello';

const routers: Router[] = [
    web,
    auth,
    upload,
    hello
];

export default routers;