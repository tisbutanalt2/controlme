import { useEffect, useState } from 'react';
import UI from '@components/ui';

const WebcamSettings = () => {
    const [currentDevice, setCurrentDevice] = useState<string|undefined>();
    const [fetched, setFetched] = useState<boolean>(false);

    const [webcams, setWebcams] = useState<{ id: string; label: string }[]>([]);

    useEffect(() => {
        if (webcams.length) return;
        
        navigator.mediaDevices.enumerateDevices().then(list => {
            setWebcams(list.filter(device => device.kind === 'videoinput').map(cam => ({ id: cam.deviceId, label: cam.label })));
        });
    }, [webcams]);

    useEffect(() => {
        if (!fetched && !currentDevice) {
            window.ipcMain.getConfigValue('webcamDevice').then((id: string|undefined) => {
                setCurrentDevice(id);
                setFetched(true);
            });

            return;
        }

        currentDevice && window.ipcMain.setConfigValue('webcamDevice', currentDevice);
    }, [fetched, currentDevice]);

    useEffect(() => {
        currentDevice && window.ipcMain.setConfigValue('webcamDevice', currentDevice);
    }, [currentDevice]);

    return <UI.Field
        name="webcamDevice"
        type="select"
        label="Device"
        description="Set which webcam you want the app to use when capturing your camera"
        value={currentDevice}
        options={webcams.filter(d => d.id).map((device) => ({
            value: device.id,
            label: device.label ?? device.id
        }))}
        sx={{ width: '320px', maxWidth: '100%' }}
        onChange={v => {
            setCurrentDevice(v);
        }}
    />
}

export default WebcamSettings;