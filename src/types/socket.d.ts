declare global {
    namespace ControlMe {
        namespace Socket {
            // Wtf is this (it's fine, it works)
            type Callback<CB extends ((...args: Array<unknown>) => void) = (...args: Array<unknown>) => void> = (err?: string|false|null,...args: Parameters<CB>) => void;
    
            interface ServerEvents {
                functions: (cb: (f: Record<string, boolean>) => void) => void;
                invokeFunction: (name: string, props?: RSAny, res?: (res: ControlMe.FunctionResultObject & { success: true }) => void, rej?: (err?: string) => void) => void;
            }
    
            interface ClientEvents {
                approved: () => void;
                rejected: (reason: string) => void;
            }
    
            interface InternalEvents {
    
            }
    
            interface Data {
                user: Auth.User;
            }
            
            type Server = import('socket.io').Server<ServerEvents, ClientEvents, InternalEvents, Data>;
        }

        type Socket = import('socket.io').Socket<Socket.ServerEvents, Socket.ClientEvents, Socket.InternalEvents, Socket.Data>;
        type ClientSocket = import('socket.io-client').Socket<Socket.ClientEvents, Socket.ServerEvents>
    }
}

export {};