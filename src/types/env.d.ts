declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV?: 'development';
        }
    }
}

export {};