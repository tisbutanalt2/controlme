import { useState, useEffect } from 'react';

import TabForm from './TabForm';
import Field from '@components/Field';

import Button from '@muim/Button';
import Stack from '@muim/Stack';
import FormHelperText from '@muim/FormHelperText';

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

    console.log(serverStatus);

    return <TabForm id="settings-server" name="server">
        <Field
            name="autoStart"
            type="switch"
            label="Auto start"
            description="Automatically starts the server when the app is launched"
        />

        <Field
            name="notification"
            type="switch"
            label="Notification on server start"
            description="Displays a desktop notification when the server is started"
        />

        <Stack direction="row" columnGap="12px" mt="24px">
            <Field
                name="port"
                type="number"
                label="Port"
                placeholder="3000"
                sx={{ width: '120px', minWidth: '64px' }}
                min={0}
                max={65535}
            />

            <Button
                disabled={serverStatus !== 'closed'}
                variant="outlined"
                color="success"
                onClick={window.ipc.startServer}
            >Start</Button>

            <Button
                disabled={serverStatus !== 'open'}
                variant="outlined"
                color="error"
                onClick={window.ipc.stopServer}
            >Stop</Button>

            <Button
                disabled={serverStatus !== 'open'}
                variant="outlined"
                color="warning"
                onClick={window.ipc.restartServer}
            >Restart</Button>
        </Stack>
        <FormHelperText>Insert 0 if unsure</FormHelperText>

        <Field
            name="address"
            type="text"
            label="Server address"
            description="Optional fallback when Ngrok is not used, set to public URL, or localhost:[port] if testing locally"
            sx={{ mt: '24px', width: '240px', minWidth: '120px' }}
        />
    </TabForm>
}

export default ServerSettings;