import { createContext, useContext } from 'react';

export interface Connection {
    socket: ControlMe.ClientSocket;
}

const ConnectionContext = createContext<State<Connection|undefined>>([undefined, () => {}]);

export const useConnection = () => useContext(ConnectionContext)[0];
export const useConnectionContext = () => useContext(ConnectionContext);

export default ConnectionContext;