import TabForm from './TabForm';
import UI from '@components/ui';

const SecuritySettings = () => {
    return <TabForm id="settings-security" name="security">
        <UI.Field
            name="disablePanicKeybind"
            warningLevel="high"
            type="switch"
            label="Disable panic keybind"
            description="Disables the keybind you can use to forcefully quit the app"
            warningMessage="This option disables the ability to close the app in an alternative way (Ctrl+Shift+P). Are you sure you want to turn this keybind off?"
        />

        <UI.Field
            name="disableAuth"
            warningLevel="high"
            type="switch"
            label="Disable authentication"
            description="Disables the need for authentication, granting access to anyone with your server address."
            warningMessage="The security layer prevents unwanted access. Are you sure you want to turn this off?"
        />
    </TabForm>
}

export default SecuritySettings;