import { useState } from 'react';
import UI from '@components/ui';
import { ShareLinkType } from 'enum';

const Share = () => {
    const [form, setForm] = useState<Omit<Auth.ShareLink, 'id'|'type'> & { type?: ShareLinkType }>({});

    return <main>
        <h1>Share a link!</h1>
        
        <UI.MUI.HelperText>
            To let others access your PC, you need to create a share link.
            Optionally, you can create overrides for what functions someone
            can access when they use your link. Otherwise, the access level
            will be controlled by the values defined in settings.
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
                    options={[
                        { label: 'Access', value: String(ShareLinkType.Access) },
                        { label: 'Signup', value: String(ShareLinkType.Signup) },
                        { label: 'Discord', value: String(ShareLinkType.Discord) }
                    ]}
                    onChange={v => setForm(prev => ({
                        ...prev,
                        type: Number(v) as ShareLinkType
                    }))}
                    sx={{ mt: 1, minWidth: 120 }}
                />
            </UI.Stack>
        </UI.Form>
    </main>
}

export default Share;