import { ipcMain } from 'electron';

import { Server } from 'http';
import { Server as IO } from 'socket.io';

import { randomUUID } from 'crypto';

import configStore from '@utils/store/config';
import context from '@main/context';
import getFunctionAccess from '@utils/server/getFunctionAccess';

import decodeUserToken from '@utils/server/decodeUserToken';
import authStore from '@utils/store/auth';

import functions from '@/functions';
import S = ControlMe.Socket;

import log from '@utils/log';

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
            discordJwt,

            // Used by access links
            displayName
        } = socket.handshake.auth as RSAny;
        
        if (!jwt && !sid && !discordJwt) return next(new Error('Missing authentication parameters'));
        
        let user = jwt && decodeUserToken(jwt);
        const shareLink = !user && sid && authStore.get(`shareLinks.${sid}`) as Auth.ShareLink;
        if (!user && !shareLink) user = decodeUserToken(discordJwt);

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
        const isDiscord = !!(socket.data.user as Auth.DiscordUser)?.id;
        const isLogin = !!(socket.data.user as Auth.User)?.password;

        log(`${socket.data.displayName} connected (${socket.id})`);
        context.sockets.push(socket);

        socket.on('requestApproval', () => {
            if (configStore.get('security.disableFutureRequests' as keyof Auth.AuthStore) && !socket.data.user?.approved) return socket.emit('denied');

            const requestId = randomUUID();
            log(`Socket id ${socket.id} requested approval, request ID: ${requestId}`);
            if (configStore.get('security.approveAuth') && (!socket.data.user?.approved || configStore.get('security.alwaysApprove'))) {
                context.modules.notification?.webContents.send('notification', {
                    id: requestId,
                    title: 'Connection request',
                    imageSrc: (socket.data.user as Auth.DiscordUser)?.avatar,
                    description: `${socket.data?.displayName} (${socket.data?.user?.username || 'Anonymous'}) wants to connect`,
                    timeout: 120_000,
                    yesNo: true
                } as ControlMe.Web.Notification);

                ipcMain.once('notificationResult', (e, result: boolean|null) => {
                    if (result !== true) return socket.emit('denied');
                    socket.emit('approved');

                    if (isDiscord) authStore.set(`discordUsers.${(socket.data.user as Auth.DiscordUser).id}.approved` as keyof Auth.AuthStore, true);
                    if (isLogin) authStore.set(`users.${(socket.data.user as Auth.User).username}.approved` as keyof Auth.AuthStore, true);
                });
            }

            else {
                socket.emit('approved');
                context.modules.notification?.webContents.send('notification', {
                    id: randomUUID(),
                    description: `${socket.data.displayName} connected!`,
                    timeout: 5000,
                    noClose: true
                } as ControlMe.Web.Notification);
            }
        });

        socket.on('function', async (name, args, cb) => {
            const hasAccess = getFunctionAccess(socket.data.accessOverrides)[name];
            if (!hasAccess) return cb('You do not have access to this function');

            const func = functions[name];
            if (!func) return cb?.('This function has not been implemented');

            const id = socket.data.user?.username ?? (socket.data.user as Auth.DiscordUser)?.id;

            log(`Function call: ${name} [called by ${socket.data.displayName}${id? ` (id: ${id})` : ''}]\nParameters: ${args.map(arg =>
                String(typeof arg === 'object'? JSON.stringify(arg) : arg)
            ).join(', ')}`);

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