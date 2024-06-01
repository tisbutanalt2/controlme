import { forward } from '@ngrok/ngrok';
import configStore from '@utils/store/config';

export default async function connectNgrok(port: number): Promise<ControlMe.NgrokResponse> {
    try {
        const tunnel = await forward({
            proto: 'http',
            addr: port,
            authtoken: configStore.get('ngrok.authToken') || undefined,
            domain: configStore.get('ngrok.domain') || undefined
        });

        return {
            url: tunnel.url(),
            tunnel
        }

        /*const url = await connect({
            proto: 'http',
            addr: port,
            authtoken: authToken,
            domain,
            binPath: prevPath => prevPath.replace('app.asar', 'app.asar.unpacked')
        });

        return {
            url,
            disconnect: () => disconnect(url)
        }*/
    } catch(err) {
        console.error('Failed to connect to ngrok');
        console.error(err);

        return String(err);
    }
}