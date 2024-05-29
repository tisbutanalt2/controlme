import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

import { useAccessSetup } from '@context/AccessSetup'
import SocketContext from '@context/Socket';

import Functions from './Functions';

// Import functions
import OpenLink from './Functions/openLink';
import UploadMedia from './Functions/UploadMedia';
import UploadFiles from './Functions/UploadFiles';
import SetBackground from './Functions/SetBackground';
import Screenshot from './Functions/Screenshot';
import Webcam from './Functions/Webcam';
import ImagePopup from './Functions/ImagePopup';

const Main = () => {
    const [socket, setSocket] = useState<Socket|null>(null);
    const accessSetup = useAccessSetup();
    
    const sid = accessSetup?.shareLink?.id;
    const jwt = accessSetup?.jwt;

    useEffect(() => {
        if (socket || (!sid && !jwt)) return;

        const sock = io({
            path: '/socket',
            auth: {
                jwt,
                sid,
                displayName: accessSetup?.displayName
            },
            addTrailingSlash: false,
            forceNew: true
        });

        const interval = setInterval(() => {
            if (sock.id) {
                setSocket(sock);
                clearInterval(interval);
            }
        }, 200);
    }, [socket, sid, jwt]);

    if (!accessSetup.functions) return null;
    
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
        </Functions>
    </SocketContext.Provider>
}

export default Main;