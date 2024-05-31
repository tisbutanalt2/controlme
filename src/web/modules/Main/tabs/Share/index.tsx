import { useEffect, useState, useCallback } from 'react';
import { useNgrokURL } from '@context/Ngrok';

import Form from '@components/Form';
import Field from '@components/Field';

import Button from '@muim/Button';
import Stack from '@muim/Stack';
import FormHelperText from '@muim/FormHelperText';

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

        window.ipc.on('shareLink.added', (link: Auth.ShareLink) => {
            setLinks(prev => [...prev, link]);
        });

        window.ipc.on('shareLink.deleted', (id: string) => {
            setNewest(prev => prev === id? null: prev);
            setLinks(prev => prev.filter(l => l.id !== id));
        });

        window.ipc.onConfigValueChange('server.address', (newAddress: string) => {
            setFallback(newAddress);
        });

        window.ipc.getConfigValue('server.address')
            .then(setFallback);

        window.ipc.getShareLinks().then(setLinks);
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
            <FormHelperText>
                To let others access your PC, you need to create a share link.
                Optionally, you can create overrides for what functions someone
                can access when they use your link. Otherwise, the access level
                defaults to the values defined in settings.
            </FormHelperText>

            <Form id="sharelink-create" state={[form, setForm]} sx={{ mt: '24px' }}>
                <Stack
                    direction="column"
                    gap="24px"
                    justifyContent="center"
                >
                    <Field
                        name="type"
                        type="select"
                        label="Link type"
                        description="Signup links allow for the receiver to create a user in your app, while access links provide direct access!"
                        options={[
                            { label: 'Access', value: 'access' },
                            { label: 'Signup', value: 'signup' }
                        ]}
                        sx={{ width: '120px', minWidth: '80px' }}
                    />

                    <Field
                        name="maxUses"
                        type="number"
                        label="maxUses"
                        description="Max amount of times the link can be uset. Set to 0 for unlimited uses."
                        min={0}
                        sx={{ width: '120px', minWidth: '64px' }}
                    />
                </Stack>

                <Button
                    disabled={generating}
                    onClick={generateLink}
                    color="success"
                    variant="outlined"
                    sx={{ width: 'fit-content', padding: '12px 32px', mt: '24px' }}
                >Share!</Button>

                {newest && <Stack
                    direction="column"
                    alignItems="flex-start"
                    mt="24px"
                    gap="12px"
                >
                    <FormHelperText>Success! Link generated with ID {newest}</FormHelperText>
                    <Button color="info" variant="outlined" onClick={() => {
                        window.ipc.writeToClipboard(
                            `${ngrokURL || fallback || '[address missing]'}/?sid=${newest}`
                        );
                        setNewest(null);
                    }}>Copy to clipboard</Button>    
                </Stack>}
            </Form>

            <h2>List of active links</h2>
            {Boolean(links.length)? <div>
                {links.map((l, i) => <Stack
                    key={i}
                    direction="row"
                    alignItems="center"
                    gap="12px"
                >
                    <pre>{l.id}</pre>
                    <Button
                        variant="outlined"
                        color="info"
                        onClick={() => window.ipc.writeToClipboard(
                            `${ngrokURL || fallback || '[address missing]'}/?sid=${l.id}`
                        )}
                        sx={{ ml: 'auto' }}
                    >Copy</Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => window.ipc.deleteShareLink(l.id)}
                    >Delete</Button>
                </Stack>)}
            </div>: <FormHelperText>No links</FormHelperText>}
        </div>
    </div>
}

export default Share;