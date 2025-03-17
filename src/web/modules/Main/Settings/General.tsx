import TabForm from './TabForm';
import UI from '@components/ui';

import { useDisableWarningsState } from '@context/DisableWarnings';

const GeneralSettings = () => {
    const [disableWarnings, setDisableWarnings] = useDisableWarningsState();

    return <TabForm id="settings-general" name="general">
        <UI.Field
            name="disableWarnings"
            type="switch"
            label="Disable warnings"
            description="Disables dangerous option warnings"
            color="warning"
            value={disableWarnings}
            onChange={v => setDisableWarnings(v)}
        />

        <UI.Field
            name="launchOnStartup"
            type="checkbox"
            label="Launch on startup"
            description="Enable to automatically start the app when the computer turns on"
            warningLevel="medium"
        />

        <UI.Field
            name="startMinimized"
            type="checkbox"
            label="Start minimized"
            description="Enable to hide the control panel when the app is launched"
        />

        <UI.Field
            name="exitOnClose"
            type="checkbox"
            label="Exit on close"
            description="Shuts down the entire app when you close the control panel"
        />
    </TabForm>
}

export default GeneralSettings;