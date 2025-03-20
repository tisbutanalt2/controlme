import { useConnection } from '@web/Connection';

const Main = () => {
    const connection = useConnection()!;

    return <main>
        {connection.socket.id}
    </main>
}

export default Main;