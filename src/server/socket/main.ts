import { type Socket } from 'socket.io';
import S = ControlMe.Socket;

import context from 'ctx';
import log from 'log';

import functions from 'functions';
import { UserType } from 'enum';

import configStore from '@stores/config';
import getFunctionAccess from '@utils/server/getFunctionAccess';

export default function handleSocket(socket: Socket<S.ServerEvents, S.ClientEvents, S.InternalEvents, S.Data>) {
    context.sockets.push(socket);

    const user = socket.data.user;
    const userDesc = user.type === UserType.Access
        ? `Access: ${user.displayName} (${user._key})` :
        user.type === UserType.Discord
        ? `Discord: ${user.displayName} (${user.userId})` :
        `Login: ${user.displayName}${user.username !== user.displayName ? ` (${user.username})` : ''}`;
        
    log(`${userDesc} connected`);

    socket.on('disconnect', () => {
        const index = context.sockets.indexOf(socket);
        if (index >= 0) context.sockets.splice(index, 1);

        log(`${userDesc} disconnected`, 'info', false);
    });

    socket.on('functions', cb => {
        const list = getFunctionAccess(socket.data.user.functionOverrides);
        const record: Record<string, boolean> = {};

        list.forEach(fn => record[fn] = true);
        
        const base = configStore.get('functions');
        Object
            .entries(base)
            .forEach(([name, func]) => {
                record[name] = func.enabled;

                const f = functions.find(f => f.name === name);
                f?.additionalPermissions?.forEach(perm => {
                    record[perm.name] ??= Boolean(configStore.get(`functions.${name}.options.${perm.name}`));
                });
            });

        functions.filter(f => typeof record[f.name] !== 'boolean')
            .forEach(f => record[f.name] = false);

        cb(record);
    });

    socket.on('invokeFunction', async (name, props, res, rej) => {
        const func = functions.find(f => f.name === name);
        if (!func || func.hidden || !func.handler) return rej('This function is not implemented');

        const access = getFunctionAccess(socket.data.user.functionOverrides);
        if (!access.has(func.name)) return rej('You do not have access to use this function');

        const options = (configStore.get(`functions.${func.name}.options`) || {}) as RSAny;

        const validateRes = func.validateArgs?.(
            props,
            options,
            access,
            socket.data.user
        );

        if (validateRes !== undefined && validateRes !== true) {
            return rej(typeof validateRes === 'string'
                ? validateRes
                : 'Unknown error'
            );
        }

        // Props are valid, run the command
        try {
            const result = await func.handler(props, options || {}, socket.data.user);
            if (typeof result === 'string') return rej(result);

            if (typeof result === 'object') {
                if (!result.success) return rej(result.errorMessage ?? 'The function failed to run successfully');
                return res(result as ControlMe.FunctionResultObject & { success: true });
            }

            res({ success: true } as ControlMe.FunctionResultObject & { success: true });
        } catch(err) {
            log(err, 'error');
            rej('An error ocurred');
        }
    });
}