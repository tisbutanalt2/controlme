import type { Server } from 'http';
import { Server as IO } from 'socket.io';

import { parse } from 'cookie';
import { displayNotification } from '@ipc/notification';

import configStore from '@stores/config';
import authStore from '@stores/auth';

import handleSocket from './main';
import decodeUserToken from '@utils/server/decodeUserToken';

import { UserType } from 'enum';
import S = ControlMe.Socket;

export default function setupSockets(server: Server) {
    const io = new IO<S.ServerEvents, S.ClientEvents, S.InternalEvents, S.Data>(server, {
        path: '/socket',
        cors: {
            origin: '*'
        },
        addTrailingSlash: false
    });

    // Add 'user' to socket data
    io.use((socket, next) => {
        const authDisabled = configStore.get('security.disableAuth') as boolean;
        const cookies = parse(socket.handshake.headers.cookie) as { jwt?: string };

        const jwt = cookies?.jwt;
        if (!jwt && !authDisabled) return next(new Error('Missing JWT'));

        let user = !authDisabled && decodeUserToken(jwt);

        if (!user) {
            if (!authDisabled) return next(new Error('Invalid JWT'));
            user = {
                type: UserType.Access,
                _key: `Anon_NoAuth_${socket.id}`,
                displayName: 'Anonymous'
            };
        }

        socket.data.user = user;
        next();
    });

    // Check if approval is needed before sending to handleSocket
    io.on('connection', socket => {
        if (!configStore.get('security.approveAuth')) {
            handleSocket(socket);
            return socket.emit('approved');
        }

        const state = authStore.get(`approvedUsers.${socket.data.user._key}`) as Auth.ApprovedUser;

        let shouldApprove = true;
        if (!configStore.get('security.alwaysApproveAuth') && state) {
            const ts = Math.floor(Date.now() / 1000);
            if (state.expiration && (ts >= state.expiration)) {
                shouldApprove = true;
                authStore.delete(`approvedUsers.${socket.data.user._key}` as keyof Auth.Store);
            }

            else shouldApprove = false;
        }

        else authStore.delete(`approvedUsers.${socket.data.user._key}` as keyof Auth.Store);

        if (!shouldApprove) {
            handleSocket(socket);
            return socket.emit('approved');
        }

        const imageSrc = socket.data.user.type === UserType.Discord
            ? socket.data.user.avatar
            : undefined;

        displayNotification({
            imageSrc,
            yesNo: true,
            noClose: true,
            title: 'Connection request',
            timeout: 120_000,
            message: `${socket.data.user.displayName} (${socket.data.user._key}) is requesting access`
        }).then(approved => {
            if (!approved) {
                socket.emit('rejected', (approved === false)
                    ? 'Access was denied'
                    : 'Approval timed out'
                );
                return socket.disconnect(true);
            }

            !configStore.get('security.alwaysApproveAuth') &&
            authStore.set(`approvedUsers.${socket.data.user._key}` as keyof Auth.Store, {
                _key: socket.data.user._key
            } as Auth.ApprovedUser);

            handleSocket(socket);
            return socket.emit('approved');
        });
    });

    return io;
}