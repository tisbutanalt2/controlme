import { forward, authtoken } from '@ngrok/ngrok';
import configStore from '@stores/config';

import waitForSeconds from '@utils/promise/waitForSeconds';
import log from 'log';

export default async function connectNgrok(port: number, fallbacks?: Array<ControlMe.NgrokFallback>): Promise<ControlMe.Ngrok|string> {
    fallbacks ??= (configStore.get('ngrok.fallbacks') as Array<ControlMe.NgrokFallback>|undefined)?.filter(f => f.authToken);
    if (!(fallbacks instanceof Array)) fallbacks = [];

    const fallback = fallbacks.length && fallbacks?.splice(0, 1)[0] || undefined;

    const token = fallback?.authToken || configStore.get('ngrok.authToken') || undefined;
    const domain = fallback?.domain || configStore.get('ngrok.domain') || undefined;

    try {
        await authtoken(token);

        const tunnel = await forward({
            proto: 'http',
            addr: port,
            authtoken: token,
            domain
        });

        return {
            url: tunnel.url(),
            tunnel
        }
    } catch(err) {
        // Silly recursion to run through fallback tokens
        if (fallbacks.length) {
            log('Failed to connect to Ngrok. Attempting the next fallback in 3 seconds...', 'error');
            await waitForSeconds(3);
            return connectNgrok(port, fallbacks);
        }

        return String(err);
    }
}