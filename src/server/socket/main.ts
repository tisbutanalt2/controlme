import { type Socket } from 'socket.io';
import S = ControlMe.Socket;

import context from 'ctx';
import log from 'log';

import functions from 'functions';
import invokeFunction from '@utils/server/invokeFunction';

import configStore from '@stores/config';
import getFunctionAccess from '@utils/server/getFunctionAccess';

import userLabel from '@utils/string/userLabel';

export default function handleSocket(socket: Socket<S.ServerEvents, S.ClientEvents, S.InternalEvents, S.Data>) {
    context.sockets.push(socket);
    const label = userLabel(socket.data.user);

    log(`${label} connected`);

    socket.on('disconnect', () => {
        const index = context.sockets.indexOf(socket);
        if (index >= 0) context.sockets.splice(index, 1);

        log(`${label} disconnected`, 'info', false);
    });

    socket.on('functions', cb => {
        const arr: Array<ControlMe.ReducedFunction> = [];

        const base = configStore.get('functions');
        const access = getFunctionAccess(socket.data.user.functionOverrides);

        Object
            .keys(base)
            // Filter by each function the user can access
            .filter(name => {
                if (!access.has(name)) return false;

                const f = functions.find(f => f.name === name);
                if (f?.additionalPermissions?.some(p => !access.has(p.name))) return false;

                return true;
            })
            .forEach((name) => {
                const f = functions.find(f => f.name === name);
                if (!f) return;
                arr.push({
                    name,
                    title: f.title,
                    description: f.userDescription ?? f.description,
                    additionalPermissions: f.additionalPermissions,
                    custom: f.custom,
                    hidden: f.hidden,
                    parameters: f.parameters
                });
            });

        cb(arr);
    });

    socket.on('invokeFunction', async (name, props, res) => {
        if (typeof res !== 'function')
            return log(`Function ${name} was called, but result callback was not a function`, 'warning', false);

        const functionRes = await invokeFunction(name, socket.data.user, props);
        res(functionRes);
    });
}