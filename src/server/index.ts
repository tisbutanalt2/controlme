import express, {
    type Request,
    type Response,
    type NextFunction
} from 'express';
import cookieParser from 'cookie-parser';

//import context from 'ctx';

import { createServer } from 'http';
import type { AddressInfo } from 'net';

import setupSockets from './socket';

// Import middleware
import middleware from './middleware';

// Import routers
import routers from './routers';
import log from 'log';

export default function startExpress(port: number) {
    const app = express();
    const server = createServer(app);

    app.use(cookieParser());
    app.use(express.json());

    app.use(middleware);
    routers.forEach(r => app.use(r));

    const io = setupSockets(server);

    app.use((
        err: unknown,
        _req: Request,
        res: Response,
        _next: NextFunction
    ) => {
        if (typeof err === 'string') return res.status(400).send(err);

        log(`Internal server error: ${String(err)}`);
        res.status(500).send('An error ocurred');
    });

    return new Promise<ControlMe.Server|string>(res => {
        server.listen(port, () => {
            const assignedPort = (server.address() as AddressInfo).port;
            res({
                express: app,
                http: server,
                port: assignedPort,
                io
            });
        })
    }).catch(err => String(err?.message || err));
}