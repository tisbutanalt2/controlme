import TabForm from './TabForm';
import UI from '@components/ui';

import { useSettingsContext } from '.';

const DiscordSettings = () => {
    const [settings] = useSettingsContext();

    return <TabForm id="settings-discord" name="discord">
        <UI.Field
            name="useCustomApplication"
            type="switch"
            label="Custom Application"
            description="Enable if you want to use a custom Discord Application for authentication"
        />

        <UI.Field
            name="applicationId"
            type="text"
            label="Application ID"
            disabled={!settings.discord.useCustomApplication}
        />

        <UI.Field
            name="applicationSecret"
            type="text"
            password
            label="Application Secret"
            disabled={!settings.discord.useCustomApplication}
        />
    </TabForm>
}

export default DiscordSettings;