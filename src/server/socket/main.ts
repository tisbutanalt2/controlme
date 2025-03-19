import { type Socket } from 'socket.io';
import S = ControlMe.Socket;

import context from 'ctx';
import log from 'log';

import functions from 'functions';

export default function handleSocket(socket: Socket<S.ServerEvents, S.ClientEvents, S.InternalEvents, S.Data>) {
    context.sockets.push(socket);
    log(`${socket.data.user.displayName} (${socket.data.user._key}) connected`);

    socket.on('disconnect', () => {
        const index = context.sockets.indexOf(socket);
        if (index >= 0) context.sockets.splice(index, 1);

        console.log(`Socket ${socket.id} (${socket.data.user.displayName}) disconnected`);
    });

    socket.on('invokeFunction', (name, props, res, rej) => {
        rej('Not implemented');
    });
}