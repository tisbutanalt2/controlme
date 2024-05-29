import { useCurrentTab } from '@context/Tabs';
import { tabs } from '@utils/constants';

const Tab: FC<{ name: string }> = ({ name, children }) => {
    const currentTab = useCurrentTab();

    const tabIndex = tabs.findIndex(tab => tab.name === name);
    if (tabIndex < 0) return null;

    return <div className="tab" hidden={currentTab !== tabIndex}>
        {children}
    </div>;
}

export default Tab;