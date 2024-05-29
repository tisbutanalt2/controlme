import { useEffect, useState } from 'react';
import TabsContext from '@context/Tabs';

import { getSearchParam } from '@utils/getSearch';

import { default as MuiTabs } from '@muim/Tabs';
import Tab from '@muim/Tab';

import { tabs } from '@utils/constants';

const Tabs: FC<{ searchParam?: string }> = ({ searchParam, children }) => {
    const [currentTab, setCurrentTab] = useState<number>(0);
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        if (mounted) return;
        setMounted(true);

        if (!searchParam) return;

        const searchValue = getSearchParam(searchParam);
        if (!searchValue) return setCurrentTab(0);

        let previousUrl = window.location.href;
        const observer = new MutationObserver(() => {
            if (window.location.href === previousUrl) return;
            previousUrl = window.location.href;

            const newSearchValue = getSearchParam(searchParam);
            const tabIndex = tabs.findIndex(tab => tab.name === newSearchValue);

            setCurrentTab(Math.max(tabIndex, 0));
        });

        observer.observe(document, { subtree: true, childList: true });

        const tabIndex = tabs.findIndex(tab => tab.name === searchValue);
        setCurrentTab(Math.max(tabIndex, 0));

        return () => {
            observer.disconnect();
        }
    }, [mounted, searchParam]);

    return <TabsContext.Provider value={[currentTab, setCurrentTab]}>
        <MuiTabs visibleScrollbar sx={{ bgcolor: 'var(--c-background-1)', minWidth: 'fit-content' }} value={currentTab} onChange={(e, i) => setCurrentTab(i)}>
            {tabs.filter(tab => !tab.hideInTabs).map((tab, i) => <Tab key={i} label={tab.label} />)}
        </MuiTabs>
        {children}
    </TabsContext.Provider>
}

export default Tabs;