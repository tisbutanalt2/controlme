import { connect, disconnect } from 'ngrok';
import configStore from '@utils/store/config';

export default async function connectNgrok(port: number): Promise<ControlMe.NgrokResponse> {
    const authToken: string|undefined = configStore.get('ngrok.authToken') || undefined;
    const domain: string|undefined = configStore.get('ngrok.domain') || undefined;

    try {
        const url = await connect({
            proto: 'http',
            addr: port,
            authtoken: authToken,
            domain,
            binPath: prevPath => prevPath.replace('app.asar', 'app.asar.unpacked')
        });

        return {
            url,
            disconnect: () => disconnect(url)
        }
    } catch(err) {
        console.error('Failed to connect to ngrok');
        console.error(err);
    }
}