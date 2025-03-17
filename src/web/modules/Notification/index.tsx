import { useEffect } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';

import Base from './Base';

const Sub = () => {
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const removeListener = window.ipcNotification.onNotification(notif => {
            // @ts-ignore
            enqueueSnackbar({
                variant: 'notification',
                key: notif.id,
                ...notif,
                onNotificationClose: (v: boolean|undefined) => {
                    if (notif.yesNo) v ??= false;
                    window.ipcNotification.notificationResult(notif.id, v);
                }
            });
        });

        window.ipcNotification.ready();

        return () => {
            removeListener();
        }
    }, [enqueueSnackbar]);

    return null;
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