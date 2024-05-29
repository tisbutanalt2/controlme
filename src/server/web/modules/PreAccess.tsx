import { useState, useEffect } from 'react';
import Prompt from '@components/Prompt';

import { useAccessSetupState } from '@context/AccessSetup';
import { useModuleState } from '@context/Module';

const PreAccess = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [form, setForm] = useState<RSAny|null>(null);

    const [,setAccessSetup] = useAccessSetupState();
    const [,setModule] = useModuleState();

    useEffect(() => {
        if (!form) {
            const stored = window.localStorage.getItem('access-setup');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (typeof parsed === 'object')
                        setForm(parsed);
                    else
                        setOpen(true);
                } catch {
                    setOpen(true);
                }
            }

            else setOpen(true);
        }

        else {
            window.localStorage.setItem('access-setup', JSON.stringify(form));
            console.log(`Using display name ${form.displayName}`);

            setAccessSetup(prev => ({
                ...prev,
                ...form
            }));
            setModule('main');
        }
    }, [form]);

    return <Prompt
        open={open}
        onClose={() => setOpen(false)}
        onAction={(action, data) => {
            setForm({
                displayName: data?.displayName || 'Anonymous'
            });
        }}
        canClose={false}
        title="Access setup"
        message="Before you can access this computer, you need to fill in this short form."
        formId="access-setup"
        fields={[
            {
                name: 'displayName',
                type: 'text',
                label: 'Display name',
                description: 'Leave empty for Anonymous'
            }
        ]}
        actions={[
            { name: 'submit', label: 'Submit', variant: 'outlined' }
        ]}
    />
}

export default PreAccess;