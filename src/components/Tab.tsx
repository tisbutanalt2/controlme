import { useTabsContext } from './Tabs';

const Tab: FC<{ value: string }> = ({ value, children }) => {
    const currentTab = useTabsContext();
    if (!currentTab) return null;

    return <div className="tab" hidden={currentTab !== value}>
        {children}
    </div>
}

export default Tab;