import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

import { useAccessSetup } from '@context/AccessSetup'
import SocketContext from '@context/Socket';

import Functions from './Functions';

// Import functions
import OpenLink from './Functions/OpenLink';
import UploadMedia from './Functions/UploadMedia';
import UploadFiles from './Functions/UploadFiles';
import SetBackground from './Functions/SetBackground';
import Screenshot from './Functions/Screenshot';
import Webcam from './Functions/Webcam';
import ImagePopup from './Functions/ImagePopup';
import RunCommand from './Functions/RunCommand';

const Main = () => {
    const [socket, setSocket] = useState<Socket|null>(null);
    const [denied, setDenied] = useState<boolean>(false);
    const accessSetup = useAccessSetup();
    
    const sid = accessSetup?.shareLink?.id;
    const jwt = accessSetup?.jwt;
    const discordJwt = accessSetup?.discordJwt;

    useEffect(() => {
        if (socket || (!sid && !jwt)) return;

        const sock = io({
            path: '/socket',
            auth: {
                jwt,
                discordJwt,
                sid,
                displayName: accessSetup?.displayName
            },
            addTrailingSlash: false,
            forceNew: true
        });

        const interval = setInterval(() => {
            if (sock.id) {
                sock.once('approved', () => {
                    setSocket(sock);                    
                });

                sock.once('denied', () => {
                    setDenied(true)
                    sock.close();
                });

                sock.emit('requestApproval');
                clearInterval(interval);
            }
        }, 200);
    }, [socket, sid, jwt, discordJwt]);

    if (!accessSetup.functions) return null;
    if (denied) return <h2>You were denied access</h2>
    if (!socket) return <h2>Awaiting approval...</h2>
    
    return <SocketContext.Provider value={[socket, setSocket]}>
        <h2>Functions</h2>
        {Object.values(accessSetup?.functions ?? {}).every(f => !f) && <pre>No function access granted</pre>}
        <Functions>
            <OpenLink />
            <UploadMedia />
            <UploadFiles />
            <ImagePopup />
            <SetBackground />
            <Screenshot />
            <Webcam />
            <RunCommand />
        </Functions>
    </SocketContext.Provider>
}

export default Main;
