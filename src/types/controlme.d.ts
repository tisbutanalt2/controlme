declare global {
    namespace ControlMe {
        type Functions = typeof import('@utils/controlFunctions').default;
        interface FolderDefinition {
            source: string;
            readSubfolders: boolean;
        }

        interface Settings {
            general: {
                disableWarnings: boolean;

                startMinimized: boolean;
                exitOnClose: boolean;

                /** Potentially dangerous: Launches the app on startup */
                launchOnStartup: boolean;
            };

            appearance: {
                title?: string;
                darkTheme: boolean;
            };

            functions: {[K in keyof Partial<Functions>]: boolean};

            webcam: {
                device?: string;
            }

            files: {
                shareAll: boolean;

                mediaFolders: FolderDefinition[];
                fileFolders: FolderDefinition[];

                maxSizeBytes: number;
                maxSizeUnit: string;

                maxMediaUploads: number;
                maxFileUploads: number;
            }

            security: {
                disablePanicKeybind: boolean;

                checkForBadHashes?: boolean;

                /** DANGEROUS: Disabled the need for authentication */
                disableAuth: boolean;

                /** Third party authentication server */
                authServer?: string;

                /** Require manual approval to allow user to connect */
                approveAuth?: boolean;

                /** Always manually approve requests, even if the user was approved previously */
                alwaysApprove?: boolean;

                disableFutureRequests?: boolean;
            };

            server: {
                port: number;
                autoStart: boolean;

                /** Whether to notify when the server starts */
                notification: boolean;
                address: string;
            };

            ngrok: {
                autoStart: boolean;
                domain?: string;
                authToken?: string;
            }
        }

        interface FunctionDefinition {
            name: string;
            title: string;
            description: string;

            categories?: string[];

            dangerous?: boolean;
            veryDangerous?: boolean;

            dangerousMessage?: string;
            
            requires?: string|string[];
            requireAll?: boolean
        }

        type ServerStatus = 'closed'|'starting'|'open'|'error'|(string & {});
        type NgrokStatus = 'closed'|'starting'|'open'|'error'|(string & {});

        interface Statuses {
            server: ServerStatus|null,
            ngrok: NgrokStatus|null
        }

        interface Errors {
            server: string;
            ngrok: string;
        }

        interface Server {
            express: ReturnType<typeof import('express')>;
            http: import('http').Server;
            port: number;
            io: Socket.Server;
        }

        type ServerResponse = Server|string;

        type Ngrok = {
            url: string;
            tunnel: import('@ngrok/ngrok').Listener;
        };

        type NgrokResponse = Ngrok|string;
    }
}

export {};