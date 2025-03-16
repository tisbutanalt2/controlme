import type { Server } from 'http';
import { Server as IO } from 'socket.io';

import S = ControlMe.Socket;

export default function setupSockets(server: Server) {
    const io = new IO<S.ServerEvents, S.ClientEvents, S.InternalEvents, S.Data>(server, {
        path: '/socket',
        cors: {
            origin: '*'
        },
        addTrailingSlash: false
    });

    return io;
}