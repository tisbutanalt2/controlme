import { useEffect, useState } from 'react';
import { useNgrokState } from '@context/Ngrok';

import TabForm from './TabForm';
import UI from '@components/ui';

const NgrokSettings = () => {
    const [ngrokStatus, setNgrokStatus] = useState<ControlMe.NgrokStatus>('closed');
    const [ngrokURL, setNgrokURL] = useNgrokState();
    const [ngrokError, setNgrokError] = useState<string|null>(null);

    const [mounted, setMounted] = useState<boolean>(false);
    const [waitingForNewStatus, setWaitingForNewStatus] = useState<boolean>(false);

    useEffect(() => {
        if (mounted) return;
        setMounted(true);

        window.ipc.ngrokStatus()
            .then((status: ControlMe.NgrokStatus) => {
                setNgrokStatus(status);
            }).catch(console.error);

        window.ipc.ngrokError()
            .then((err: string) => {
                setNgrokError(err);
            }).catch(console.error);

        window.ipc.on('ngrokStatus', (status: ControlMe.NgrokStatus) => {
            setNgrokStatus(status);
            setWaitingForNewStatus(false);

            switch(status) {
                case 'open':
                    window.ipc.ngrokUrl().then(setNgrokURL);
                    break;
                case 'closed':
                    setNgrokURL(null);
                    break;
                case 'error':
                    window.ipc.ngrokError().then(setNgrokError);
                    break;
            }
        });
    }, [mounted]);

    return <TabForm id="settings-ngrok" name="ngrok">
        <UI.Field
            name="autoStart"
            type="switch"
            label="Auto start"
            description="Automatically starts the tunnel when the app is launched"
        />

        <UI.Field
            name="authToken"
            type="text"
            label="Auth token"
            description="Your Ngrok Authentication token"
            sx={{ mt: '24px', width: '400px' }}
        />

        <UI.Field
            name="domain"
            type="text"
            label="Domain"
            description="Set this if you've reserved an Ngrok domain"
            sx={{ mt: '12px', width: '300px' }}
        />

        <UI.Stack direction="row" columnGap="12px" mt="24px">
            <UI.Button
                disabled={(ngrokStatus !== 'closed') || waitingForNewStatus}
                variant="outlined"
                color="success"
                onClick={() => {
                    setWaitingForNewStatus(true);
                    window.ipc.startNgrok();
                }}
            >Start</UI.Button>

            <UI.Button
                disabled={(ngrokStatus !== 'open') || waitingForNewStatus}
                variant="outlined"
                color="error"
                onClick={() => {
                    setWaitingForNewStatus(true);
                    window.ipc.stopNgrok();
                }}
            >Stop</UI.Button>

            <UI.Button
                disabled={(ngrokStatus !== 'error') || waitingForNewStatus}
                variant="outlined"
                color="warning"
                onClick={() => {
                    setWaitingForNewStatus(true);
                    window.ipc.startNgrok();
                }}
            >Retry</UI.Button>
        </UI.Stack>

        {ngrokStatus === 'open' && ngrokURL && <UI.MUI.HelperText>
            Available at <a target="blank" href={ngrokURL}>{ngrokURL}</a>
        </UI.MUI.HelperText>}

        {ngrokStatus === 'error' && <>
            <UI.MUI.HelperText sx={{ color: 'var(--c-error)'}}>
                There was an error connecting to Ngrok
            </UI.MUI.HelperText>

            {ngrokError && <pre style={{ color: 'var(--c-error)' }}>{ngrokError}</pre>}
        </>}
    </TabForm>
}

export default NgrokSettings;