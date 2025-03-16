declare global {
    namespace ControlMe.Socket {
        // Wtf is this (it's fine, it works)
        type Callback<CB extends ((...args: any[]) => void) = (...args: any[]) => void> = (err?: string|false|null,...args: Parameters<CB>) => void;

        interface ServerEvents {
            invokeFunction: (name: string & keyof ControlMe.Functions, args: any[], cb?: Callback) => void;
        }

        interface ClientEvents {
            
        }

        interface InternalEvents {

        }

        interface Data {
            user?: Auth.User|Auth.DiscordUser;
            sid?: string;
            displayName: string;
            accessOverrides?: Auth.AccessOverrides;
            approved?: boolean;
        }
        
        type Server = import('socket.io').Server<ServerEvents, ClientEvents, InternalEvents, Data>;
    }

    type Socket = import('socket.io').Socket<Socket.ServerEvents, Socket.ClientEvents, Socket.InternalEvents, Socket.Data>;
}

export {};