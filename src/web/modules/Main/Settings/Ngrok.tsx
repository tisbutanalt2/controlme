import { useEffect, useState } from 'react';
import { useNgrokState } from '@context/Ngrok';
import { useSettingsContext } from '.';

import { ServerStatus } from 'enum';

import TabForm from './TabForm';
import UI from '@components/ui';

import AddIcon from '@muii/Add';
import DeleteIcon from '@muii/DeleteForever';

const Fallback: FC<ControlMe.NgrokFallback & { arraykey: number }> = props => {
    const [settings, setSettings] = useSettingsContext();
    const data = settings.ngrok.fallbacks?.[props.arraykey];

    return <UI.Stack direction="row" gap="12px">
        <UI.MUI.TextField
            type="password"
            label="Authtoken"
            value={data?.authToken}
            onChange={e => setSettings(prev => {
                const copy = { ...prev, ngrok: { ...prev.ngrok } };

                const d = copy.ngrok.fallbacks?.[props.arraykey];
                if (!d) return prev;

                d.authToken = e.target.value;
                return copy;
            })}
        />

        <UI.MUI.TextField
            type="text"
            label="Domain"
            value={data?.domain}
            onChange={e => setSettings(prev => {
                const copy = { ...prev, ngrok: { ...prev.ngrok } };
                console.log(copy);

                const d = copy.ngrok.fallbacks?.[props.arraykey];
                if (!d) return prev;

                d.domain = e.target.value;
                return copy;
            })}
        />

        <UI.MUI.Tooltip title="Delete Fallback">
            <UI.MUI.IconButton
                color="error"
                onClick={() => {
                    setSettings(prev => {
                        const copy = { ...prev, ngrok: { ...prev.ngrok } };

                        copy.ngrok.fallbacks?.splice(props.arraykey, 1);
                        copy.ngrok.fallbacks = [...copy.ngrok.fallbacks];

                        return copy;
                    });
                }}
            >
                <DeleteIcon />
            </UI.MUI.IconButton>
        </UI.MUI.Tooltip>
    </UI.Stack>
}

const NgrokSettings = () => {
    const [ngrokStatus, setNgrokStatus] = useState<ControlMe.ServerStatus>(ServerStatus.Closed);
    const [ngrokUrl, setNgrokUrl] = useNgrokState();
    const [ngrokError, setNgrokError] = useState<string|undefined>();

    const [mounted, setMounted] = useState<boolean>(false);
    const [waiting, setWaiting] = useState<boolean>(false);

    const [settings, setSettings] = useSettingsContext();

    useEffect(() => {
        if (mounted) return;
        setMounted(true);

        window.ipcMain.ngrokStatus().then(setNgrokStatus);
        window.ipcMain.ngrokError().then(setNgrokError);

        window.ipcMain.on('ngrok.status', (status: ControlMe.ServerStatus) => {
            setNgrokStatus(status);
            setWaiting(false);

            switch(status) {
                case ServerStatus.Open:
                    window.ipcMain.ngrokUrl().then(setNgrokUrl);
                    break;
                case ServerStatus.Closed:
                    setNgrokUrl(undefined);
                    break;
                case ServerStatus.Error:
                    window.ipcMain.ngrokError().then(setNgrokError);
                    break;
            }
        });
    }, [mounted]);

    return <TabForm id="settings-ngrok" name="ngrok">
        <UI.MUI.HelperText>
            Ngrok is used to route internet traffic to your computer, without needing to port forward.
            Unless you know what you're doing,
            please <a href="https://dashboard.ngrok.com/signup" target="_blank" title="Sign up to Ngrok">Create an Account</a> if you don't have one.
        </UI.MUI.HelperText>

        <UI.Field
            name="autoStart"
            type="switch"
            label="Auto start"
            description="Automatically starts the tunnel when the app is launched"
        />

        <UI.Field
            disabled={ngrokStatus !== ServerStatus.Closed}
            name="authToken"
            type="text"
            password
            label="Auth token"
            sx={{ mt: '12px', width: '300px' }}
        />

        <UI.MUI.HelperText>
            Your Ngrok <a href="https://dashboard.ngrok.com/get-started/your-authtoken" target="_blank" title="Go to Ngrok Auth Token">Authentication Token</a>
        </UI.MUI.HelperText>

        <UI.Field
            disabled={ngrokStatus !== ServerStatus.Closed}
            name="domain"
            type="text"
            label="Domain"
            sx={{ mt: '8px', width: '300px' }}
        />

        <UI.MUI.HelperText>
            Set this if you've reserver an <a href="https://dashboard.ngrok.com/cloud-edge/domains" target="_blank" title="Go to Ngrok Domains">Ngrok Domain</a>
        </UI.MUI.HelperText>

        <UI.Stack direction="row" columnGap="12px" mt="12px">
            <UI.Button
                disabled={!settings?.ngrok?.authToken || (ngrokStatus !== ServerStatus.Closed) || waiting}
                variant="outlined"
                color="success"
                onClick={() => {
                    setWaiting(true);
                    window.ipcMain.startNgrok();
                }}
            >Start</UI.Button>

            <UI.Button
                disabled={(ngrokStatus !== ServerStatus.Open) || waiting}
                variant="outlined"
                color="error"
                onClick={() => {
                    setWaiting(true);
                    setNgrokUrl(undefined);
                    window.ipcMain.stopNgrok();
                }}
            >Stop</UI.Button>

            <UI.Button
                disabled={(ngrokStatus !== ServerStatus.Error) || waiting}
                variant="outlined"
                color="warning"
                onClick={() => {
                    setWaiting(true);
                    setNgrokUrl(undefined);
                    window.ipcMain.restartNgrok();
                }}
            >Retry</UI.Button>
        </UI.Stack>

        <h2>Fallback Accounts</h2>
        <UI.MUI.HelperText sx={{ mb: '16px' }}>
            Ngrok comes with a monthly data limit. You may add multiple auth tokens and domains here, and the app will automatically
            try each one until it can successfully connect.
        </UI.MUI.HelperText>

        {settings.ngrok.fallbacks?.map((fallback, i) => <Fallback {...fallback} arraykey={i} key={i} />)}
        <UI.Button
            variant="outlined"
            color="success"
            onClick={() => setSettings(prev => {
                const copy = { ...prev, ngrok: { ...prev.ngrok } };
                copy.ngrok.fallbacks ??= [];
                copy.ngrok.fallbacks.push({ authToken: '' });
                return copy;
            })}
            sx={{
                mt: settings.ngrok.fallbacks?.length ? '8px' : undefined
            }}
        >
            <AddIcon />
        </UI.Button>

        {ngrokStatus === ServerStatus.Open && ngrokUrl && <UI.MUI.HelperText>
            Available at <a href={ngrokUrl} target="_blank">{ngrokUrl}</a>    
        </UI.MUI.HelperText>}

        {ngrokStatus === ServerStatus.Error && <>
            <UI.MUI.HelperText sx={{ color: 'var(--c-error)' }}>
                There was an error connecting to Ngrok
            </UI.MUI.HelperText>

            {ngrokError && <pre style={{ color: 'var(--c-error)' }}>{ngrokError}</pre>}
        </>}
    </TabForm>
}

export default NgrokSettings;