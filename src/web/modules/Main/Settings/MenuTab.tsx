import { useMenuContext } from '.';
import { settingsTabs } from 'const';

const MenuTab: FC<{ name: string; title?: string }> = ({ name, title, children }) => {
    const [index] = useMenuContext();

    return <div hidden={settingsTabs.findIndex(tab => tab.name === name) !== index}>
        {title && <h1>{title}</h1>}
        {children}
    </div>
}

export default MenuTab;