import { useSettingsContext } from '.';
import Form from '@appui/Form';

interface Props {
    id: string;
    name: string & keyof ControlMe.Settings;
}

const TabForm: FC<Props> = ({ id, name, children }) => {
    const [settings, setSettings] = useSettingsContext();

    return <Form id={id} state={[
        settings[name] as RSAny,
        v => setSettings(prev => ({
            ...prev,
            [name]: (typeof v === 'function')
                ? v(prev[name as string])
                : v
        }))
    ]}>
        {children}
    </Form>
}

export default TabForm;