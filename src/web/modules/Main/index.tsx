import { type Location, MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router';
import Providers from '@providers/index';

import Tabs from '@components/Tabs';
import { mainTabs } from 'const';

import Welcome from './Welcome';
import Chat from './Chat';
import Share from './Share';
import Settings from './Settings';

const MainTabs = () => {
    const location = useLocation() as Location<string>;
    const navigate = useNavigate();

    return <Tabs
        className="tabs"
        list={mainTabs}
        value={location.pathname}
        onChange={v => navigate(v, { replace: true })}
    >
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/share" element={<Share />} />
            <Route path="/chat" element={<></>} />
            <Route path="/settings" element={<Settings />} />
        </Routes>

        <div hidden={location.pathname !== '/chat'}>
            <Chat />
        </div>
    </Tabs>
}

const Main = () => {
    return <MemoryRouter
        initialEntries={[{ pathname: '/' }]}
    >
        <Providers>
            <MainTabs />
        </Providers>
    </MemoryRouter>
}

export default Main;