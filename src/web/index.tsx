import { createRoot } from 'react-dom/client';
import { getSearchParam } from '@utils/getSearch';

import App from './modules/App';
import Popup from './modules/Popup';

const appModule = getSearchParam('module');
const root = createRoot(document.querySelector('div#root'));

document.body.classList.add(`module-${appModule}`);

switch(appModule) {
    case 'main':
        root.render(<App />);
        break;
    case 'wallpaper':
        root.render(<>Wallpaper module :3</>);
        break;
    case 'popup':
        root.render(<Popup />);
        break;
    default:
        console.warn(`Module ${appModule} does not exist`);
        break;
}