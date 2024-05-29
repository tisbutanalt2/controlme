import { AddressInfo, createServer } from 'net';
export default async function getFreePort() {
    return new Promise<number>(res => {
        const srv = createServer();
        srv.listen(0, () => {
            const port = (srv.address() as AddressInfo).port;
            srv.close((err) => res(port));
        });
    })
}