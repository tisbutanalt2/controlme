import { VideoCapture } from 'camera-capture';
import configStore from '@utils/store/config';

import getFreePort from '@utils/getFreePort';

export default async function webcamImage() {
    const c = new VideoCapture({
        mime: 'image/png',
        port: await getFreePort(),
    });

    await c.initialize();
    await c.startCamera({ video: { deviceId: configStore.get('webcam.device') || undefined }});

    const image = await c.readFrame();
    
    c.stop();
    return `data:image/png;base64,${image.data.toString('base64')}`;
}