import { useEffect } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';

import Base from './Base';

/*
declare module 'notistack' {
    interface VairantOverrides {
        notification: true;
    }
}
*/

const Sub = () => {
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        window.ipcNotification.onNotification(notif => {
            // @ts-ignore
            enqueueSnackbar({
                variant: 'notification',
                key: notif.id,
                ...notif,
                onNotificationClose: (v: boolean|undefined) => {
                    if (notif.yesNo) v ??= false;
                    window.ipcNotification.notificationResult(notif.id, v);
                }
            })
        });
    }, [enqueueSnackbar]);

    return <div className="notifications">
        <button onClick={() => {
            const randomId = `abcd-${Math.floor(Math.random() * 10000)}`
            // @ts-ignore
            enqueueSnackbar({
                key: randomId,
                message: 'This completely random user is requesting access to your PC :3 it would be really awesome if this text wasn\'t so long',
                variant: 'notification' as unknown as 'info',
                title: 'Connection request',
                imageSrc: 'https://cdn.discordapp.com/avatars/431910344915550219/b7e849724f80f8b419c79f1ae962efaf.webp?size=128',
                imageWidth: 128,
                imageHeight: 128,
                roundImage: true,
                id: randomId,
                yesNo: true,
                timeout: 3000,
                onNotificationClose: (v: boolean|undefined) => {
                    
                }
            });
        }}>Test</button>
    </div>
}

const Notification = () => {
    return <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        disableWindowBlurListener
        autoHideDuration={null}
        Components={{
            // @ts-ignore
            notification: Base
        }}
        classes={{
            root: 'notistack-root'
        }}
    >
        <Sub />
    </SnackbarProvider>
}

export default Notification;