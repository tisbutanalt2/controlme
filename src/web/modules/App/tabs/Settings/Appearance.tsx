//import { useSettingsContext } from '.';
import { useColorModeState } from '@context/ColorMode';

import TabForm from './TabForm';
import Field from '@components/Field';

const AppearanceSettings = () => {
    //const [settings, setSettings] = useSettingsContext();
    const [colorMode, setColorMode] = useColorModeState();

    return <TabForm id="settings-appearance" name="appearance">
        <Field
            name="title"
            type="text"
            label="Website Title"
            description='Set a neat title for the tab instead of the default "Control Me!"'
        />

        <Field
            name="darkTheme"
            type="switch"
            label="Dark Theme"
            description="For your eyes"
            value={colorMode === 'dark'}
            onChange={(k, v) => {
                setColorMode(v? 'dark': 'light');
            }}
            sx={{ mt: '12px' }}
        />
    </TabForm>
}

export default AppearanceSettings;