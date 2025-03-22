declare global {
    namespace ControlMe {
        namespace Socket {
            // Wtf is this (it's fine, it works)
            type Callback<CB extends ((...args: Array<unknown>) => void) = (...args: Array<unknown>) => void> = (err?: string|false|null,...args: Parameters<CB>) => void;
    
            interface ServerEvents {
                folders: (cb: (f: Array<ReducedFolder>) => void, folderType?: import('enum').FolderType) => void;
                folderContents: (id: string, cb: (files: Array<ControlMe.ShortFile>) => void, offset?: number, maxItems?: number) => void;

                functions: (cb: (f: Array<ReducedFunction>) => void) => void;
                invokeFunction: (name: string, props?: RSAny, res?: (res: ControlMe.FunctionResultObject) => void) => void;
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