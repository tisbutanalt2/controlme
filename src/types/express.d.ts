declare global {
    namespace Express {
        interface Request {
            user: Auth.User|Auth.DiscordUser;
            functionAccess: ControlMe.Settings['functions'];
        }
    }
}

export {}