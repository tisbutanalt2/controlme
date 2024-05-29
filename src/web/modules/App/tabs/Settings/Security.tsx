import TabForm from './TabForm';
import Field from '@components/Field';

const SecuritySettings = () => {
    return <TabForm id="settings-security" name="security">
        <Field
            name="disablePanicKeybind"
            veryDangerous
            type="switch"
            label="Disable panic keybind"
            description="Disables the keybind you can use to forcefully quit the app"
            dangerousMessage="This option disables the ability to close the app in an alternative way (Ctrl+Shift+P). Are you sure you want to turn this keybind off?"
        />

        <Field
            name="disableAuth"
            veryDangerous
            type="switch"
            label="Disable authentication"
            description="Disables the need for authentication, granting access to anyone with your server address."
            dangerousMessage="The security layer prevents unwanted access. Are you sure you want to turn this off?"
        />
    </TabForm>
}

export default SecuritySettings;