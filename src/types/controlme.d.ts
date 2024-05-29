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

                /** DANGEROUS: Disabled the need for authentication */
                disableAuth: boolean;
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

        type ServerStatus = 'closed'|'starting'|'open';
        type NgrokStatus = 'closed'|'open'|'error';

        interface ServerResponse {
            express: ReturnType<typeof import('express')>;
            server: import('http').Server;
            port: number;
        }

        interface NgrokResponse {
            url: string;
            disconnect(): void;
        }
    }
}

export {};