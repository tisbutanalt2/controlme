import { useColorModeState } from '@context/ColorMode';

import TabForm from './TabForm';
import UI from '@components/ui';

const AppearanceSettings = () => {
    const [colorMode, setColorMode] = useColorModeState();

    return <TabForm id="settings-appearance" name="appearance">
        <UI.Field
            name="title"
            type="text"
            label="Computer Name"
            description="Set a unique title for the browser tab."
        />

        <UI.Field
            name="darkTheme"
            type="switch"
            label={`Dark Theme ${colorMode === 'light' ? '🥶' : '😎'}`}
            description="For your eyes."
            value={colorMode === 'dark'}
            onChange={v => {
                setColorMode(v ? 'dark' : 'light');
            }}
            sx={{ mt: '12px' }}
            warningLevel="medium"
            warningOnFalse
            warningMessage="Disabling dark mode may harm your eyes and soul. Are you sure you want to disable it?"
            color="primary"
        />
    </TabForm>
}

export default AppearanceSettings;