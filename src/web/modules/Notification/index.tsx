import { useEffect, useState } from 'react';

import NotificationComponent from './Base';
import useTransparentPassthrough from '@hooks/useTransparentPassthrough';

const NotificationModule: FC = () => {
    const [notifications, setNotifications] = useState<ControlMe.Web.Notification[]>([]);

    useTransparentPassthrough(window.ipcNotification.focus, window.ipcNotification.blur);

    useEffect(() => {
        const cleanup = window.ipcNotification.on('notification', (props: ControlMe.Web.Notification) => {
            setNotifications(prev => [
                ...prev.filter(n => n.id !== props.id),
                props
            ]);
        });

        return () => {
            cleanup();
        }
    }, []);

    return <div className="notifications">
        {notifications.map((notif, i) => <NotificationComponent
            key={notif.id}
            {...notif}
            onClose={result => {
                setNotifications(prev => prev.filter(n => n.id !== notif.id));
                window.ipcNotification.notificationResult(result);
            }}
        />)}
    </div>
}

export default NotificationModule;