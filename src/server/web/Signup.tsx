import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { useDataContext } from './Data';

import UI from '@components/ui';
import validateSignup from '@utils/validateSignup';

import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();

    const [data, setData] = useDataContext();
    const [form, setForm] = useState<{ username: string; password: string }>({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string|undefined>();

    useEffect(() => {
        if (!form.username && !form.password) return setErrors({});

        const res = validateSignup(form.username, form.password);
        if (res === true) return setErrors({});

        setErrors({
            username: res.username,
            password: res.password
        });
    }, [form]);

    const submit = useCallback(() => {
        if (Object.keys(errors).length || !data.sid) return;
        setSubmitting(true);
        setSubmitError(undefined);

        axios.post(`/auth/signup?sid=${data.sid}`, {
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
    }, [data.sid, form, errors]);

    if (!data.sid) return <main><pre className="error">The Share ID is missing</pre></main>

    return <main className="signup">
        <div className="info">
            <h1>Sign Up!</h1>
            <p>Create an account to access this app.</p>
            <p>
                <strong>Note:</strong> passwords are hashed, but this does NOT
                mean that your password can't be brute forced! Please create
                a unique password to ensure maximum safety.
            </p>
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

export default Signup;