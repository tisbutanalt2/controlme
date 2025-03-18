import TabForm from './TabForm';
import UI from '@components/ui';

const ChatSettings = () => {


    return <TabForm id="settings-chat" name="chat">
        <UI.Field
            name="notifyOnMessage"
            type="switch"
            label="Notifications"
            description="Displays a notification whenever a message is sent in the chat."
        />
    </TabForm>
}

export default ChatSettings;