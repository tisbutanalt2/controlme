import { useEffect, useState } from 'react';

import TabForm from './TabForm';
import UI from '@components/ui';

const WebcamSettings = () => {
    const [webcams, setWebcams] = useState<{ id: string; label: string }[]>([]);

    useEffect(() => {
        if (webcams.length) return;
        //window.ipc.getWebcams().then(list => setWebcams(list || []));
        navigator.mediaDevices.enumerateDevices().then(list => {
            setWebcams(list.filter(device => device.kind === 'videoinput').map(cam => ({ id: cam.deviceId, label: cam.label })));
        })
    }, [webcams]);

    return <TabForm id="settings-webcam" name="webcam">
        <UI.Field
            name="device"
            type="select"
            label="Device"
            description="Set which webcam you want the app to use when capturing your camera"
            options={webcams.map((device) => ({
                value: device.id,
                label: device.label
            }))}
            sx={{ width: '320px', maxWidth: '100%' }}
        />
    </TabForm>
}

export default WebcamSettings;