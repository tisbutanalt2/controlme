import { useEffect, useState } from 'react';

import axios, { AxiosError } from 'axios';
import { getSearchParam } from '@utils/getSearch';

import ColorModeProvider from '@components/providers/ColorMode';
import ModuleContext from '@context/Module';
import AccessSetupContext from '@context/AccessSetup';
import WebErrorContext from '@context/WebError';
import PromptProvider from '@components/providers/Prompt';

import Module from '@components/Module';
import Loading from '@components/Loading';

// Import modules
import PreAccess from './modules/PreAccess';
import Signup from './modules/Signup';
import Login from './modules/Login';
import Main from './modules/Main';

const App = () => {
    const [module, setModule] = useState<string>('loading');
    const [accessSetup, setAccessSetup] = useState<ControlMe.Web.AccessSetup|null>(null);

    const [webError, setWebError] = useState<string|null>(null);

    useEffect(() => {
        if (accessSetup?.shareLink) return;

        const sid = getSearchParam('sid');
        const storedToken = window.localStorage.getItem('jwt');

        const getShareLink = () => axios.get(`/sharelink?sid=${getSearchParam('sid') || ''}`)
            .then(res => {
                const link = res.data as Auth.ReducedShareLink;
                
                setAccessSetup(prev => ({ ...prev, shareLink: link, functions: link.functions }));
                setModule(link.type === 'access'? 'preaccess': 'signup');
            }).catch((err: AxiosError) => {
                console.error(err);
                setWebError('Failed to get share link: ' + String(err.response.data || err.message || err));
        });

        if (!sid || storedToken) {
            if (typeof storedToken === 'string')
                axios.get('/auth/access', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                })
                    .then(res => {
                        console.log(res);
                        setAccessSetup(prev => ({
                            ...prev,
                            jwt: storedToken,
                            ...res.data as ControlMe.Web.AccessSetup
                        }));
                        setModule('main');
                    })
                    .catch(() => {
                        window.localStorage.removeItem('jwt');
                        sid
                            ? getShareLink()
                            : setModule('login')
                    });
            else
                setModule('login');
        }

        else getShareLink();
    }, [accessSetup?.shareLink]);

    useEffect(() => {
        axios.get('/title').then(res => {
            document.title = res.data || 'Control Me!';
        }).catch(console.error);
    }, []);

    /*useEffect(() => {
        if (socket) return;

        const sock = io('/', { path: '/socket' });
        const interval = setInterval(() => {
            if (!sock.id) return;
            setSocket(sock);
            clearInterval(interval);
        }, 400);
    }, [socket]);*/

    return <ModuleContext.Provider value={[webError? 'error': module, setModule]}>
        <ColorModeProvider noIpc>
            <AccessSetupContext.Provider value={[accessSetup, setAccessSetup]}>
                <WebErrorContext.Provider value={[webError, setWebError]}>
                    <PromptProvider>
                        <h1>Control Me! (Still a work in progress)</h1>
                        
                        <Module name="loading" persistent>
                            <Loading visible={module === 'loading'} />
                        </Module>

                        <Module name="login">
                            <Login />
                        </Module>

                        <Module name="signup">
                            <Signup />
                        </Module>

                        <Module name="preaccess">
                            <PreAccess />
                        </Module>
                        
                        <Module name="main">
                            <Main />
                        </Module>

                        <Module name="error">
                            <h2>ERROR</h2>
                            <p>An error has occurred!</p>
                            <pre>{webError}</pre>
                            <p>More info has been logged to the console</p>
                        </Module>
                    </PromptProvider>
                </WebErrorContext.Provider>
            </AccessSetupContext.Provider>
        </ColorModeProvider>
    </ModuleContext.Provider>
}

export default App;