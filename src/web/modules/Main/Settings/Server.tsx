import { useEffect, useState } from 'react';
import { ServerStatus } from 'enum';

import TabForm from './TabForm';
import UI from '@components/ui';

const ServerSettings = () => {
    const [serverStatus, setServerStatus] = useState<ServerStatus>(ServerStatus.Closed);
    const [serverError, setServerError] = useState<string|undefined>();
    const [waiting, setWaiting] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        if (mounted) return;
        setMounted(true);

        window.ipcMain.serverStatus().then(setServerStatus);
        window.ipcMain.on('server.status', (status: ServerStatus) => {
            setServerStatus(status);
            setWaiting(false);
        });
        
        window.ipcMain.on('server.error', (err: string) => {
            setServerError(err);
        });
    }, [mounted]);

    return <TabForm id="settings-server" name="server">
        <UI.MUI.HelperText>
            To grant access to your computer, this app hosts a website.
            <br />
            The server can be on any port, as long as you ensure that
            traffic can reach it.
        </UI.MUI.HelperText>

        <UI.Field
            name="autoStart"
            type="switch"
            label="Auto start"
            description="Automatically starts the server when the app is launched"
        />

        <UI.Field
            name="notifyOnStart"
            type="switch"
            label="Notification on server start"
            description="Displays a desktop notification when the server is started"
        />

        <UI.Stack direction="row" columnGap="12px" mt="12px">
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
                disabled={waiting || (serverStatus !== ServerStatus.Closed)}
                variant="outlined"
                color="success"
                onClick={() => {
                    setWaiting(true);
                    setServerError(undefined);
                    window.ipcMain.startServer();
                }}
            >Start</UI.Button>

            <UI.Button
                disabled={waiting || (serverStatus !== ServerStatus.Open)}
                variant="outlined"
                color="error"
                onClick={() => {
                    setWaiting(true);
                    setServerError(undefined);
                    window.ipcMain.stopServer();
                }}
            >Stop</UI.Button>

            <UI.Button
                disabled={waiting || (serverStatus !== ServerStatus.Open)}
                variant="outlined"
                color="warning"
                onClick={() => {
                    setWaiting(true);
                    setServerError(undefined);
                    window.ipcMain.restartServer();
                }}
            >Restart</UI.Button>
        </UI.Stack>
        <UI.MUI.HelperText>Insert 0 if unsure</UI.MUI.HelperText>

        <UI.Field
            name="address"
            type="text"
            label="Server address"
            description="Fallback address when Ngrok is not available, set to public URL, or localhost:port if testing locally"
            sx={{ mt: '24px', width: '240px', minWidth: '120px' }}
        />

        {serverStatus === ServerStatus.Error && <>
            <UI.MUI.HelperText sx={{ color: 'var(--c-error)' }}>
                The server experienced an error
            </UI.MUI.HelperText>

            {serverError && <pre style={{ color: 'var(--c-error)' }}>{serverError}</pre>}
        </>}
    </TabForm>
}

export default ServerSettings;