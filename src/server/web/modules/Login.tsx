import { useState, useEffect } from 'react';
import Prompt from '@components/Prompt';

import { useAccessSetupState } from '@context/AccessSetup';
import { useModuleState } from '@context/Module';
import { useWebErrorState } from '@context/WebError';

import axios, { AxiosError } from 'axios';

const Login = () => {
    const [open, setOpen] = useState<boolean>(true);
    const [form, setForm] = useState<RSAny|null>(null);

    const [,setAccessSetup] = useAccessSetupState();
    const [,setModule] = useModuleState();
    const [,setWebError] = useWebErrorState();

    useEffect(() => {
        if (!form) return;
        axios.post(`/auth/login`, {
            username: form.username,
            password: form.password
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
    }, [form]);

    return <Prompt
        open={open}
        onClose={() => setOpen(false)}
        onAction={(action, data) => {
            setForm({
                username: String(data?.username),
                password: String(data?.password)
            });
        }}
        validate={data => {
            const username: string = data.username;
            const pass: string = data.password;

            const errs: Record<string, string> = {};
            
            if (!username) errs.username = 'Required';
            if (!pass) errs.pass = 'Required';

            return errs;
        }}
        canClose={false}
        title="Log in to control this PC!"
        message="This PC is password protected. To access, please log in."
        formId="login"
        fields={[
            {
                name: 'username',
                type: 'text',
                label: 'Username',
            },

            {
                name: 'password',
                type: 'text',
                label: 'Password',
                password: true,
                sx: { mt: '48px' }
            }
        ]}
        actions={[
            { name: 'submit', label: 'Submit', variant: 'outlined', requiresValid: true }
        ]}
    />
}

export default Login;