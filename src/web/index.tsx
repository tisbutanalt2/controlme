import { createRoot } from 'react-dom/client';
import { getSearchParam } from '@utils/getSearch';

import { appTitle } from 'const';

// Import modules
import Main from './modules/Main';
import Notification from './modules/Notification';
import Popup from './modules/Popup';

const root = createRoot(document.querySelector('div#root'));

const appModule = getSearchParam('module');
if (appModule) {
    document.body.classList.add(`module-${appModule}`);
    document.head.title = `${appTitle}${appModule === 'main' ? '' : ` (${appModule} module)`}`
}

window.onerror = (err) => {
    (window.ipcMain ?? window.ipcNotification)?.sendError(String(err), appModule);
};

switch(appModule) {
    case 'main':
        root.render(<Main />);
        break;
    case 'notification':
        root.render(<Notification />);
        break;
    case 'popup':
        root.render(<Popup />);
        break;
    default:
        root.render(<>No module specified</>)
}