//import { join } from 'path';
//import { existsSync, mkdirSync } from 'fs';

import { connect, disconnect, upgradeConfig } from 'ngrok';
//import downloadNgrok from 'ngrok/download';

import configStore from '@utils/store/config';
//const binPath = join(__dirname, 'bin');

export default async function connectNgrok(port: number) {
    const authToken: string|undefined = configStore.get('ngrok.authToken') || undefined;
    const domain: string|undefined = authToken && configStore.get('ngrok.domain');

    /*if (!existsSync(binPath)) {
        mkdirSync(binPath);
        await new Promise<void>((res, rej) => {
            downloadNgrok(err => {
                err? rej(err): res();
            });
        });
    }*/

    //const connect = (await import('ngrok')).default as unknown as typeof import('ngrok').connect;

    return connect({
        proto: 'http',
        addr: port,
        authtoken: authToken,
        domain: domain || undefined,
        binPath: path => path.replace('app.asar', 'app.asar.unpacked')
    })
        .then(url => {
            console.log(`Hosting at ${url}`);

            return {
                url,
                disconnect: () => disconnect(url)
            }
        })
        .catch(err => {
            console.log(`Failed to connect to Ngrok:`);
            console.error(err);
            return { error: (err?.message || err) as string }
        });
}