import { useState, useMemo } from 'react';
import { useConnection } from '@web/Connection';

import Tabs from '@components/Tabs';
import Tab from '@components/Tab';

import Functions from './Functions';

const Main = () => {
    const connection = useConnection();
    const [tab, setTab] = useState<string>('');

    const list = useMemo(() => {
        const arr: Array<{ label: string; value: string }> = [
            { label: 'Functions', value: 'functions' }
        ];

        connection.availableFunctions.has('chat') && arr.push({ label: 'Chat', value: 'chat' });

        if (arr.length === 1) setTab(arr[0].value);
        return arr;
    }, [connection.availableFunctions]);

    return <Tabs
        value={tab}
        list={list}
        onChange={setTab}
        hidden={list.length === 1}
    >

        <Tab value="functions">
            <Functions />
        </Tab>

        {connection.availableFunctions.has('chat') && <Tab value="chat">
            Chat coming soon...    
        </Tab>}
    </Tabs>
}

export default Main;