import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { useConnectionContext } from './Connection';
import { io } from 'socket.io-client';

import Backdrop from '@muim/Backdrop';
import Progress from '@muim/CircularProgress';

import UI from '@components/ui';

const Connect = () => {
    const [mounted, setMounted] = useState(false);
    const [, setConnection] = useConnectionContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (mounted) return;
        setMounted(true);

        const socket = io({
            path: '/socket',
            addTrailingSlash: false,
            forceNew: true,
            reconnection: false
        }) as ControlMe.ClientSocket;

        socket.on('approved', () => {
            socket.emit('functions', functions => {
                const availableFunctions = new Set<string>();
                functions.forEach(func => availableFunctions.add(func.name));

                socket.emit('folders', folders => {
                    setConnection({
                        socket,
                        functions,
                        availableFunctions,
                        folders
                    });
                    navigate('/');
                });
            });
        });

        let rejected = false;
        socket.on('rejected', reason => {
            rejected = true;
            throw new Error(reason);
        });

        socket.on('disconnect', () => {
            if (rejected) return;
            throw new Error(`Socket disconnected`);
        })
    }, [mounted, navigate]);

    return <Backdrop open>
        <UI.Stack className="connecting" direction="column" alignItems="center">
            <Progress />
            <UI.MUI.HelperText>Requesting access</UI.MUI.HelperText>
        </UI.Stack>
    </Backdrop>
}

export default Connect;