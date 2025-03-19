import { useEffect, useState } from 'react';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router';

import WebProviders from '@providers/Web';
import DataContext from './Data';
import ConnectionContext, { type Connection } from './Connection';

import Loading from './Loading';
import Connect from './Connect';
import Login from './Login';
import Signup from './Signup';

const Sub = () => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [data, setData] = useState<ControlMe.MinifiedWebData|undefined>({});
    const [connection, setConnection] = useState<Connection|undefined>();

    const navigate = useNavigate();

    useEffect(() => {
        if (loaded) return;

        let parsed: ControlMe.MinifiedWebData|undefined;
        let dataElem = document.querySelector('script#controlme-data');
        
        if (dataElem) {
            try {
                parsed = JSON.parse(dataElem.textContent);
                if (parsed) {
                    setLoaded(true);
                    setData(parsed);
                    
                    if (parsed.su) {
                        // window.history.replaceState({}, document.title, '/');
                        navigate('/signup');
                    }

                    else
                        navigate('/connect');
                }
            } catch {}
        }

        if (!parsed) {
            setLoaded(true);
            navigate('/login');
            return;
        }
    }, [loaded, navigate]);

    return <ConnectionContext.Provider value={[connection, setConnection]}>
        <DataContext.Provider value={[data, setData]}>
            <Routes>
                <Route path="/" element={<>Actual functions coming soon</>} />
                <Route path="/loading" element={<Loading />} />
                <Route path="/connect" element={<Connect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </DataContext.Provider>
    </ConnectionContext.Provider>
}

const App = () => {
    return <MemoryRouter initialEntries={['/loading']}>
        <WebProviders>
            <Sub />
        </WebProviders>
    </MemoryRouter>
}

export default App;