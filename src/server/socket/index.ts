import { Server } from 'http';
import { Server as IO } from 'socket.io';

import configStore from '@utils/store/config';
import context from '@main/context';
import getFunctionAccess from '@utils/server/getFunctionAccess';

import decodeUserToken from '@utils/server/decodeUserToken';
import authStore from '@utils/store/auth';

import functions from '@/functions';
import S = ControlMe.Socket;

export default function setupSockets(server: Server) {
    const io = new IO<S.ServerEvents, S.ClientEvents, S.InternalEvents, S.Data>(server, {
        path: '/socket',
        cors: {
            origin: '*'
        },
        addTrailingSlash: false
    });

    io.use((socket, next) => {
        const {
            jwt,
            sid,

            // Used by access links
            displayName
        } = socket.handshake.auth as RSAny;
        
        if (!jwt && !sid) return next(new Error('Missing authentication parameters'));
        
        const user = decodeUserToken(jwt);
        const shareLink = !user && sid && authStore.get(`shareLinks.${sid}`) as Auth.ShareLink;
        
        socket.data.displayName = user?.displayName || displayName || 'Anonymous';

        if (shareLink) {
            const expired = shareLink.expiresAt
                ? new Date(shareLink.expiresAt).valueOf() < Date.now()
                : false;

            if (expired) {
                authStore.delete(`shareLinks.${sid}` as keyof Auth.AuthStore);
                return next(new Error('This link has expired'));
            }

            const currentUses = shareLink.currentUses ?? 0;
            const maxUses = shareLink.maxUses ?? 0;

            // TODO link counts as used every time a refresh occurs
            if (
                maxUses !== 0 &&
                currentUses >= maxUses
            ) return next(new Error('This link has already been used the max amount of times'));
        }

        if (!user && !shareLink && !configStore.get('security.disableAuth')) return next(new Error('Authentication failed'));

        socket.data.user = user;
        socket.data.sid = sid;
        socket.data.accessOverrides = user?.accessOverrides ?? shareLink?.accessOverrides;

        next();
    });

    io.on('connection', socket => {
        console.log(`${socket.data.displayName} connected (${socket.id})`);
        context.sockets.push(socket);

        socket.on('function', async (name, args, cb) => {
            const hasAccess = getFunctionAccess(socket.data.accessOverrides)[name];
            if (!hasAccess) return cb('You do not have access to this function');

            const func = functions[name];
            if (!func) return cb?.('This function has not been implemented');

            try {
                const result = await func(...args);
                cb?.(null, result);
            } catch(err) {
                console.log(err);
                cb?.(String(err?.message || err));
            }
        });

        socket.on('disconnect', () => {
            console.log(`${socket.data.displayName} disconnected (${socket.id})`);
            
            const socketIndex = context.sockets.indexOf(socket);
            socketIndex >= 0 && context.sockets.splice(socketIndex, 1);
        });
    });

    return io;
}