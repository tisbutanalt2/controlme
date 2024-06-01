import { useState, useEffect } from 'react';

import TabForm from './TabForm';
import UI from '@components/ui';

const ServerSettings = () => {
    const [serverStatus, setServerStatus] = useState<ControlMe.ServerStatus>('closed');
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        if (mounted) return;
        setMounted(true);

        window.ipcMain.serverStatus()
            .then((status: ControlMe.ServerStatus) => {
                setServerStatus(status);
            }).catch(console.error);

        window.ipcMain.on('serverStatus', (status: ControlMe.ServerStatus) => {
            setServerStatus(status);
        });
    }, [mounted]);

    return <TabForm id="settings-server" name="server">
        <UI.Field
            name="autoStart"
            type="switch"
            label="Auto start"
            description="Automatically starts the server when the app is launched"
        />

        <UI.Field
            name="notification"
            type="switch"
            label="Notification on server start"
            description="Displays a desktop notification when the server is started"
        />

        <UI.Stack direction="row" columnGap="12px" mt="24px">
            <UI.Field
                name="port"
                type="number"
                label="Port"
                placeholder="3000"
                sx={{ width: '120px', minWidth: '64px' }}
                min={0}
                max={65535}
            />

            <UI.Button
                disabled={serverStatus !== 'closed'}
                variant="outlined"
                color="success"
                onClick={window.ipc.startServer}
            >Start</UI.Button>

            <UI.Button
                disabled={serverStatus !== 'open'}
                variant="outlined"
                color="error"
                onClick={window.ipc.stopServer}
            >Stop</UI.Button>

            <UI.Button
                disabled={serverStatus !== 'open'}
                variant="outlined"
                color="warning"
                onClick={window.ipc.restartServer}
            >Restart</UI.Button>
        </UI.Stack>
        <UI.MUI.HelperText>Insert 0 if unsure</UI.MUI.HelperText>

        <UI.Field
            name="address"
            type="text"
            label="Server address"
            description="Optional fallback when Ngrok is not used, set to public URL, or localhost:[port] if testing locally"
            sx={{ mt: '24px', width: '240px', minWidth: '120px' }}
        />
    </TabForm>
}

export default ServerSettings;