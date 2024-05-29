import Store from 'electron-store';
import { defaultSettings } from '@utils/constants';

const configStore = new Store<ControlMe.Settings>({
    name: 'config',
    defaults: defaultSettings,
    watch: true
});

export default configStore;