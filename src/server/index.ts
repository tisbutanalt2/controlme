import express from 'express';

import { Server, createServer } from 'http';
import { AddressInfo } from 'net';

import setupSockets from './socket';

// Import middleware
import authMiddleware from './middlewares/auth';
import functionMiddleware from './middlewares/functions';

// Import routers
import routers from './routers';

export default function startServer(port?: number) {
    const app = express();
    const server = createServer(app);

    app.use(express.json());

    app.use(authMiddleware);
    app.use(functionMiddleware);

    // Add each router
    routers.forEach(r => app.use(r));

    const io = setupSockets(server);

    return new Promise<ControlMe.ServerResponse>(res => {
        server.listen(port ?? 0, () => {
            const assignedPort = (server.address() as AddressInfo).port;
            res({
                express: app,
                port: assignedPort,
                http: server,
                io
            });
        });
    }).catch(err => String(err?.message || err));
}