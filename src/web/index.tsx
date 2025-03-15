import { createRoot } from 'react-dom/client';
import { getSearchParam } from '@utils/getSearch';

import Main from './modules/Main';
import Popup from './modules/Popup';
import NotificationModule from './modules/Notification';

const appModule = getSearchParam('module');
const root = createRoot(document.querySelector('div#root'));

document.body.classList.add(`module-${appModule}`);

switch(appModule) {
    case 'main':
        root.render(<Main />);
        break;
    /*case 'wallpaper':
        root.render(<>Wallpaper module :3</>);
        break;*/
    case 'popup':
        root.render(<Popup />);
        break;
    case 'notification':
        root.render(<NotificationModule />);
        break;
    default:
        console.warn(`Module ${appModule} does not exist`);
        break;
}