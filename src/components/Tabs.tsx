import { createContext, useContext } from 'react';

import MuiTabs from '@muim/Tabs';
import Tab from '@muim/Tab';

export const TabsContext = createContext<string|null>(null);
export const useTabsContext = () => useContext(TabsContext);

export interface TabProps {
    value: string;
    label: string;
}

const Tabs: FCC<{
    value: string;
    onChange: (value: string) => void;
    list: TabProps[]
}> = props => {
    return <TabsContext.Provider value={props.value}>
        <MuiTabs
            className={props.className}
            visibleScrollbar
            sx={{
                bgColor: 'var(--c-background-1)',
                minWidth: 'fit-content'
            }}
            value={props.list.findIndex(t => t.value === props.value)}
            onChange={(_e, v) => props.onChange(props.list[v as number].value)}
        >
            {props.list.map((tab, i) => <Tab key={i} label={tab.label} />)}
        </MuiTabs>
        {props.children}
    </TabsContext.Provider>
}

export default Tabs;