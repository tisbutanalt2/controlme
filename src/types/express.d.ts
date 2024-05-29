declare global {
    namespace Express {
        interface Request {
            user: Auth.User;
            functionAccess: ControlMe.Settings['functions'];
        }
    }
}

export {}