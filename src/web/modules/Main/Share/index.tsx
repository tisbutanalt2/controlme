import { useCallback, useEffect, useState } from 'react';
import { ShareLinkType } from 'enum';

import UI from '@components/ui';
import Overrides from './Overrides';

export type ShareForm = Omit<Auth.ShareLink, 'id'|'type'> & { type?: ShareLinkType };

const Share = () => {
    const [mounted, setMounted] = useState<boolean>();
    const [shareLinks, setSharelinks] = useState<Array<Auth.ShareLink>|undefined>();

    const [expiration, setExpiration] = useState<number|undefined>();
    const [expirationUnit, setExpirationUnit] = useState<
        'minutes'|'hours'|'days'|'never'
    >('never');

    const [maxUses, setMaxUses] = useState<number|undefined>();

    const [form, setForm] = useState<ShareForm>({
        functionOverrides: []
    });

    useEffect(() => {
        if (mounted) return;
        setMounted(true);

        window.ipcMain.getShareLinks().then(setSharelinks);
        window.ipcMain.onShareLinkDeleted(id => {
            setSharelinks(prev => {
                if (!prev) return prev;
                return prev.filter(l => l.id !== id);
            })
        });
    }, [mounted]);

    const generate = useCallback(() => {

    }, [form, expiration, expirationUnit, maxUses]);

    return <main>
        <h1>Share a link!</h1>
        
        <UI.MUI.HelperText>
            To let others access your PC, you need to create a share link.
            Optionally, you can create overrides for what functions someone
            can access when they use your link. Otherwise, the access level
            will be controlled by the values defined in settings.
        </UI.MUI.HelperText>

        <UI.Form id="sharelink-create" state={[form, setForm]}>
            <UI.Stack gap="12px">
                <UI.Field
                    name="type"
                    type="select"
                    label="Link type"
                    options={[
                        { label: 'Access', value: String(ShareLinkType.Access) },
                        { label: 'Login', value: String(ShareLinkType.Signup) },
                        { label: 'Discord', value: String(ShareLinkType.Discord) }
                    ]}
                    onChange={v => setForm(prev => ({
                        ...prev,
                        type: Number(v) as ShareLinkType
                    }))}
                    sx={{ mt: 1, minWidth: 120 }}
                />

                {form.type !== undefined && <UI.Button
                    color="success"
                    sx={{
                        mt: '24px',
                        paddingY: '15px',
                        paddingX: '24px'
                    }}
                    onClick={() => {
                        const now = Math.floor(Date.now() / 1000);

                        const expirationTimeSeconds = expirationUnit === 'never'
                            ? undefined
                            : expirationUnit === 'minutes'
                            ? (expiration ?? 0) * 60
                            : expirationUnit === 'hours'
                            ? (expiration ?? 0) * 60 * 60
                            : (expiration ?? 0) * 60 * 60 * 24;

                        window.ipcMain.generateShareLink({
                            type: form.type!,
                            functionOverrides: form.functionOverrides,
                            maxUses: maxUses || undefined,
                            expiration: expirationTimeSeconds ? (now + expirationTimeSeconds) : undefined
                        })
                            .then(link => setSharelinks(prev => {
                                if (!prev) return [link];
                                return [...prev, link];
                            }));

                        setForm({
                            functionOverrides: []
                        });
                    }}
                >Create and Copy</UI.Button>}
            </UI.Stack>

            {form.type !== undefined && <>
                <UI.MUI.HelperText>
                    {form.type === ShareLinkType.Access && <>
                        Access links grant easy access to the app, with no requirements to set up an account.
                        All that is required is for the user to set up a display name.
                    </>}

                    {form.type === ShareLinkType.Signup && <>
                        Signup links are meant for users who should have permanent access to the app.
                        Users must write a username and password to use for future authentication.
                    </>}

                    {form.type === ShareLinkType.Discord && <>
                        Discord links grant access with the requirement of logging in to the app
                        through Discord. This is generally a safer approach, as it is easier
                        to identify someone who's trying to connect.
                    </>}
                </UI.MUI.HelperText>

                <UI.Stack gap="12px">
                    <UI.Field
                        type="number"
                        label="Expiration"
                        min={1}
                        sx={{ width: '120px' }}
                        disabled={expirationUnit === 'never'}
                        value={expirationUnit === 'never' ? undefined : expiration}
                        allowEmpty
                        onChange={v => {
                            setExpiration(v);
                        }}
                    />

                    <UI.Field
                        type="select"
                        options={[
                            { value: 'never', label: 'Never' },
                            { value: 'minutes', label: 'Minutes' },
                            { value: 'hours', label: 'Hours' },
                            { value: 'days', label: 'Days' }
                        ]}
                        value={expirationUnit}
                        onChange={v => setExpirationUnit(v)}
                        sx={{ width: '120px' }}
                    />
                </UI.Stack>
                <UI.MUI.HelperText>
                    Choose how long the link will be available. The link will automatically be deleted
                    once it is attempted accessed after its expiration.
                </UI.MUI.HelperText>

                <UI.Field
                    type="number"
                    label="Max uses"
                    min={1}
                    sx={{ width: '120px' }}
                    value={maxUses}
                    allowEmpty
                    onChange={v => {
                        setMaxUses(v);
                    }}
                />
                <UI.MUI.HelperText>
                    Set a max limit of how many times the link can be used.
                    The will automatically be deleted when the max count
                    is reached.
                </UI.MUI.HelperText>

                <Overrides />
            </>}

            <h2>Active share links</h2>
            {Boolean(shareLinks?.length) ? <>
                {shareLinks.map((l, i) => <UI.Stack key={i}>
                    <pre>{l.id}</pre>
                    <UI.Button onClick={() => window.ipcMain.deleteShareLink(l.id)}>Delete</UI.Button>
                </UI.Stack>)}
            </> : <pre>No active share links found</pre>}
        </UI.Form>
    </main>
}

export default Share;