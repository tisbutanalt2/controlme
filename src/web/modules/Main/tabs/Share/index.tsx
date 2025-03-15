import { useEffect, useState, useCallback } from 'react';
import { useNgrokURL } from '@context/Ngrok';

import UI from '@components/ui';

const Share = () => {
    const [mounted, setMounted] = useState<boolean>(false);

    const [links, setLinks] = useState<Auth.ShareLink[]>([]);
    const [generating, setGenerating] = useState<boolean>(false);
    const [newest, setNewest] = useState<string|null>(null);

    const ngrokURL = useNgrokURL();
    const [fallback, setFallback] = useState<string>('');

    const [form, setForm] = useState<Omit<Auth.ShareLink, 'id'>>({
        maxUses: 0,
        type: 'access'
    });

    useEffect(() => {
        if (mounted) return;
        setMounted(true);

        window.ipcMain.on('shareLink.added', (link: Auth.ShareLink) => {
            setLinks(prev => [...prev, link]);
        });

        window.ipcMain.on('shareLink.deleted', (id: string) => {
            setNewest(prev => prev === id? null: prev);
            setLinks(prev => prev.filter(l => l.id !== id));
        });

        window.ipcMain.onConfigValueChange('server.address', (newAddress: string) => {
            setFallback(newAddress);
        });

        window.ipcMain.getConfigValue('server.address')
            .then(setFallback);

        window.ipcMain.getShareLinks().then(setLinks);
    }, [mounted]);

    const generateLink = useCallback(() => {
        setGenerating(true);
        window.ipc.generateShareLink(form)
            .then(setNewest)
            .catch(console.error)
            .finally(() => setGenerating(false));
    }, [form]);

    return <div className="tab-generic share-tab">
        <div className="tab-generic-content">
            <h1>Share a link!</h1>
            <UI.MUI.HelperText>
                To let others access your PC, you need to create a share link.
                Optionally, you can create overrides for what functions someone
                can access when they use your link. Otherwise, the access level
                defaults to the values defined in settings.
            </UI.MUI.HelperText>

            <UI.Form id="sharelink-create" state={[form, setForm]}>
                <UI.Stack
                    direction="column"
                    gap="24px"
                    justifyContent="center"
                    alignItems="flex-start"
                >
                    <UI.Field
                        name="type"
                        type="select"
                        label="Link type"
                        description="Signup links allow for the receiver to create a user in your app, while access links provide direct access!"
                        options={[
                            { label: 'Access', value: 'access' },
                            { label: 'Signup', value: 'signup' },
                            { label: 'Discord', value: 'discord' }
                        ]}
                        sx={{ width: '120px', minWidth: '80px' }}
                    />

                    {form.type !== 'discord' && <UI.Field
                        name="maxUses"
                        type="number"
                        label="Max uses"
                        description="Max amount of times the link can be used. Set to 0 for unlimited uses."
                        min={0}
                        sx={{ width: '120px', minWidth: '64px' }}
                    />}
                </UI.Stack>

                {form.type !== 'discord' && <UI.Button
                    disabled={generating}
                    onClick={generateLink}
                    color="success"
                    variant="outlined"
                    sx={{ width: 'fit-content', padding: '12px 32px', mt: '24px' }}
                >Share!</UI.Button>}

                {form.type === 'discord' && <UI.Button
                    color="success"
                    variant="outlined"
                    sx={{ width: 'fit-content', padding: '12px 32px', mt: '24px' }}
                    onClick={async () => {
                        window.ipcMain.writeToClipboard(`${(ngrokURL || fallback)?.replace(/\/$/, '')}/auth/discord`);
                    }}
                >Copy link</UI.Button>}

                {newest && <UI.Stack
                    direction="column"
                    alignItems="flex-start"
                    mt="24px"
                    gap="12px"
                >
                    <UI.MUI.HelperText>Success! Link generated with ID {newest}</UI.MUI.HelperText>
                    <UI.Button color="info" variant="outlined" onClick={() => {
                        window.ipc.writeToClipboard(
                            `${ngrokURL || fallback || '[address missing]'}/?sid=${newest}`
                        );
                        setNewest(null);
                    }}>Copy to clipboard</UI.Button>    
                </UI.Stack>}
            </UI.Form>

            <h2>List of active links</h2>
            {Boolean(links.length)? <div>
                {links.map((l, i) => <UI.Stack
                    key={i}
                    direction="row"
                    alignItems="center"
                    gap="12px"
                >
                    <pre>{l.id}</pre>
                    <UI.Button
                        variant="outlined"
                        color="info"
                        onClick={() => window.ipc.writeToClipboard(
                            `${ngrokURL || fallback || '[address missing]'}/?sid=${l.id}`
                        )}
                        sx={{ ml: 'auto' }}
                    >Copy</UI.Button>
                    <UI.Button
                        variant="outlined"
                        color="error"
                        onClick={() => window.ipc.deleteShareLink(l.id)}
                    >Delete</UI.Button>
                </UI.Stack>)}
            </div>: <UI.MUI.HelperText>No links</UI.MUI.HelperText>}
        </div>
    </div>
}

export default Share;