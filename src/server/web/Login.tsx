import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { useDataContext } from './Data';

import UI from '@components/ui';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();

    const [,setData] = useDataContext();
    const [form, setForm] = useState<{ username: string; password: string }>({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string|undefined>();

    useEffect(() => {
        if (!form.username && !form.password) return setErrors({});
        if (!form.username || !form.password) return setErrors({
            username: form.username ? undefined : 'This field is required',
            password: form.password ? undefined : 'This field is required'
        });

        setErrors({});
    }, [form]);

    const submit = useCallback(() => {
        if (Object.keys(errors).length) return;
        setSubmitting(true);
        setSubmitError(undefined);

        axios.post(`/auth/login`, {
            username: form.username,
            password: form.password
        }).then(res => {
            setData({ u: res.data });
            window.history.replaceState({}, document.title, '/');
            navigate('/connect');
            setSubmitting(false);
        }).catch(err => {
            setSubmitError(String(err));
            setSubmitting(false);
        });
    }, [form, errors]);

    return <main className="signup">
        <div className="info">
            <h1>Login</h1>
            <p>You must log in to access this app.</p>
        </div>

        <UI.Form id="signup" state={[form, setForm]} errors={errors}>
            <UI.Field
                name="username"
                type="text"
                label="Username"
                helperId="helper-username"
            />

            <UI.Field
                name="password"
                type="text"
                password
                label="Password"
                helperId="helper-password"
            />
        </UI.Form>

        <UI.Button
            onClick={submit}
            sx={{ mt: '12px' }}
            color="success"
            disabled={!!Object.keys(errors).length || submitting || !form.username || !form.password}
        >Submit</UI.Button>

        {submitError && <pre style={{ marginTop: '8px' }} className="error">Error submitting form: {submitError}</pre>}
    </main>
}

export default Login;