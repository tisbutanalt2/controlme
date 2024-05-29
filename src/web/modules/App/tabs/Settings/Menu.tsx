import { useMenuContext } from '.';

import MenuList from '@muim/MenuList';
import MenuItem from '@muim/MenuItem';

import ListItemText from '@muim/ListItemText';
import { settingsTabs } from '@utils/constants';

const Menu = () => {
    const [index, setIndex] = useMenuContext();

    return <div className="side-menu">
        <MenuList sx={{ height: 'calc(100vh - 48px)', pt: 0 }}>
            {settingsTabs.map((tab, i) => <MenuItem
                selected={index === i}
                key={i}
                onClick={() => setIndex(i)}
            >
                <ListItemText>{tab.label}</ListItemText>
            </MenuItem>)}
        </MenuList>
    </div>
}

export default Menu;