import TabForm from './TabForm';
import UI from '@components/ui';

import { useSettingsContext } from '.';
import { usePromptCaller } from '@context/Prompt';
import { dangerousOption } from '@utils/prompts';

const SecuritySettings = () => {
    const [settings] = useSettingsContext();
    const promptCaller = usePromptCaller();

    return <TabForm id="settings-security" name="security">
        <UI.Field
            name="disablePanicKeybind"
            warningLevel="high"
            type="switch"
            label="Disable panic keybind"
            description="Disables the keybind you can use to forcefully quit the app."
            warningMessage="This option disables the ability to close the app in an alternative way (Ctrl+Shift+P). Are you sure you want to turn this keybind off?"
        />

        <UI.Field
            name="checkForBadHashes"
            type="switch"
            warningLevel="high"
            color="primary"
            warningOnFalse
            label="Check for malicious uploads (recommended)"
            description="If enabled will compare uploaded files hashes to a list of known bad hashes, will also use the third party server in the future."
            warningMessage="It is highly recommended to keep this on. Are you sure you want to disable it?"
        />

        <UI.Field
            name="disableAuth"
            warningLevel="high"
            type="switch"
            label="Disable authentication"
            description="Disables the need for authentication, granting access to anyone with your server address."
            warningMessage="The security layer prevents unwanted access. Are you sure you want to turn this off?"
        />

        <UI.Field
            name="approveAuth"
            warningLevel="medium"
            color="primary"
            warningOnFalse
            type="switch"
            label="Approve authentication requests (recommended)"
            description="If enabled will require you to approve of each connection request."
            warningMessage="This setting prevents users to connect without your approval. Are you sure you want to disable it?"
            disabled={settings.security.disableAuth}
        />

        <UI.Field
            name="alwaysApproveAuth"
            type="switch"
            label="Always approve requests"
            description="If enabled will always require manual approval, even if the user has previously connected."
            disabled={!settings.security.approveAuth || settings.security.disableAuth}
        />

        <UI.Field
            name="disableFutureRequests"
            type="switch"
            label="Disable new requests"
            description="Enable to reject any new authentication requests, useful when you do not want any new users to connect."
            disabled={settings.security.disableAuth}
        />

        <UI.Field
            name="thirdPartyServer"
            type="text"
            label="Third party server"
            description="Server used for remote authentication and hash checking, make sure you REALLY trust this server."
            placeholder="https://alive-gazelle-noted.ngrok-free.app"
            sx={{ width: '360px' }}
        />

        <UI.Button
            color="warning"
            sx={{ mt: '8px' }}
            onClick={() => {
                dangerousOption(
                    promptCaller,
                    'Are you sure you want to purge all authenticated users? This will disconnect every connected user.'
                )
                    .then(confirmed => {
                        confirmed && window.ipcMain.purgeUsers();
                    })
            }}
        >Purge authenticated users</UI.Button>

        <br />

        <UI.Button
            color="error"
            sx={{ mt: '8px' }}
            onClick={() => {
                dangerousOption(promptCaller, 'This will delete every single registered user. Continue?')
                    .then(confirmed => {
                        confirmed && window.ipcMain.deleteUsers();
                    })
            }}
        >Delete all users</UI.Button>
    </TabForm>
}

export default SecuritySettings;