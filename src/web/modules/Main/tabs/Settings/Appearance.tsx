import { useColorModeState } from '@context/ColorMode';

import TabForm from './TabForm';
import UI from '@components/ui';

const AppearanceSettings = () => {
    const [colorMode, setColorMode] = useColorModeState();

    return <TabForm id="settings-appearance" name="appearance">
        <UI.Field
            name="title"
            type="text"
            label="Website Title"
            description='Set a neat title for the tab instead of the default "Control Me!"'
        />

        <UI.Field
            name="darkTheme"
            type="switch"
            label="Dark Theme"
            description="For your eyes"
            value={colorMode === 'dark'}
            onChange={v => {
                setColorMode(v? 'dark': 'light');
            }}
            sx={{ mt: '12px' }}
        />
    </TabForm>
}

export default AppearanceSettings;