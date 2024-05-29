// SERVER COMPONENT
import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

const SocketContext = createContext<State<Socket<ControlMe.Socket.ClientEvents, ControlMe.Socket.ServerEvents>|null>>(
    [null, () => {}]
);

export const useSocket = () => useContext(SocketContext)[0];
export const useSocketState = () => useContext(SocketContext);

export default SocketContext;
