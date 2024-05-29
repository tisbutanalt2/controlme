import TabForm from './TabForm';
import Field from '@components/Field';

import { useIgnoreDangerousState } from '@context/IgnoreDangerous';

const GeneralSettings = () => {
    const [ignoreDangerous, setIgnoreDangerous] = useIgnoreDangerousState();

    return <TabForm id="settings-general" name="general">
        <Field
            name="ignoreDangerous"
            type="switch"
            label="Disable warnings"
            description="Disables dangerous option warnings"
            color="warning"
            value={ignoreDangerous}
            onChange={(k, v) => setIgnoreDangerous(v)}
        />
        
        <Field
            name="launchOnStartup"
            type="switch"
            label="Launch on startup"
            description="Enable to automatically start the app when your computer turns on"
            dangerous
        />

        <Field
            name="startMinimized"
            type="checkbox"
            label="Start minimized"
            description="Enable to hide the control panel when the app is launched"
            sx={{ mt: '24px' }}
        />

        <Field
            name="exitOnClose"
            type="checkbox"
            label="Exit on close"
            description="Shuts down any background tasks when you close the control panel"
        />
    </TabForm>
}

export default GeneralSettings;