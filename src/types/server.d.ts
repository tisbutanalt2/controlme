declare global {
    namespace Express {
        interface Request {
            user: Auth.User;
            functionAccess: Set<string>;
        }
    }

    namespace ControlMe {
        interface Server {
            express: ReturnType<typeof import('express')>;
            http: import('http').Server;
            port: number;
            io: Socket.Server;
        }
    }
}

export {};