import { useState, useEffect } from 'react';
import Prompt from '@components/Prompt';

import { useAccessSetupState } from '@context/AccessSetup';
import { useModuleState } from '@context/Module';
import { useWebErrorState } from '@context/WebError';

import axios, { AxiosError } from 'axios';

const Signup = () => {
    const [open, setOpen] = useState<boolean>(true);
    const [form, setForm] = useState<RSAny|null>(null);

    const [accessSetup, setAccessSetup] = useAccessSetupState();
    const [,setModule] = useModuleState();
    const [,setWebError] = useWebErrorState();

    const sid = accessSetup.shareLink?.id;
    useEffect(() => {
        if (!form || !sid) return;
        axios.post(`/auth/signup?sid=${sid}`, {
            username: form.username,
            password: form.password,
            displayName: form.displayName
        }).then(res => {
            window.localStorage.setItem('jwt', res.data.jwt as string);

            setAccessSetup(prev => ({
                ...prev,
                functions: res.data.functions,
                jwt: res.data.jwt,
                user: {
                    username: form.username,
                    displayName: form.displayName
                }
            }));

            setModule('main');
        }).catch((err: AxiosError) => {
            setWebError(String(err.response.data));
            console.error(err);
        });
    }, [form, sid]);

    return <Prompt
        open={open}
        onClose={() => setOpen(false)}
        onAction={(action, data) => {
            setForm({
                username: String(data?.username),
                password: String(data?.password),
                displayName: String(data?.displayName || data?.username)
            });
        }}
        validate={data => {
            const username: string = data.username;
            const pass: string = data.password;

            const errs: Record<string, string> = {};
            
            if (data.confirmPassword !== pass) errs.confirmPassword = 'Please confirm your password';
            if (!/^[a-z0-9_]{3,}$/.test(username)) errs.username = 'Must be at least 5 characters long, and can only contain lowercase letters, numbers and the _ and - symbols';
            if (!/^[^\s]{5,}$/.test(pass)) {
                errs.password = 'Must be at least 3 characters long, cannot contain spaces';
                errs.confirmPassword = errs.password;
            }

            return errs;
        }}
        canClose={false}
        title="Sign up on this PC!"
        message="Create a new user to access this computer! Login information is stored on the computer you are accessing."
        formId="signup"
        fields={[
            {
                name: 'username',
                type: 'text',
                label: 'Username',
            },

            {
                name: 'displayName',
                type: 'text',
                label: 'Display name',
                description: 'Defaults to your username',
                sx: { mt: '8px' }
            },

            {
                name: 'password',
                type: 'text',
                label: 'Password',
                password: true,
                sx: { mt: '48px' }
            },

            {
                name: 'confirmPassword',
                type: 'text',
                label: 'Confirm password',
                password: true,
                sx: { mt: '8px' }
            }
        ]}
        actions={[
            { name: 'submit', label: 'Submit', variant: 'outlined', requiresValid: true }
        ]}
    />
}

export default Signup;