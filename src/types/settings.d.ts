declare global {
    namespace ControlMe {
        interface SharedFolder {
            name: string;
            path: string;
        }

        interface NgrokFallback {
            domain: string;
            authToken: string;
        }

        interface Settings {
            general: {
                disableWarnings: boolean;

                startMinimized: boolean;
                exitOnClose: boolean;

                launchOnStartup: boolean;
            };

            appearance: {
                title?: string;
                darkTheme: boolean;
            };

            functions: Record<string, boolean>;
            webcamDevice?: string;

            files: {
                mediaFolders: Array<SharedFolder>;
                fileFolders: Array<SharedFolder>;
            };

            security: {
                disablePanicKeybind: boolean;
                checkForBadHashes: boolean;

                disableAuth: boolean;

                /** Used for discord auth and hash checking */
                thirdPartyServer?: string;

                /** Require manual approval to allow user to connect */
                approveAuth: boolean;

                /** Always manually approve requests, even if the user was previously approved */
                alwaysApproveAuth: boolean;

                /** Any future connection requests will be blocked */
                disableFutureRequests: boolean;
            };

            server: {
                port?: number;
                autoStart: boolean;

                /** Whether to display a notification when the server starts */
                notifyOnStart: boolean;

                /** Used as a fallback when Ngrok is not available */
                address?: string;
            };

            ngrok: {
                autoStart: boolean;
                domain?: string;
                authToken?: string;

                /** Fallbacks in case the Ngrok account runs out of data */
                fallbacks?: Array<NgrokFallback>;
            };

            discord: {
                /** Set to true to run discord authentication through a custom application */
                useCustomApplication: boolean;
                applicationId?: string;
                applicationSecret?: string;
            };

            chat: {
                /** Displays a notification when a message is sent, unless the chat window is actively focused on */
                notifyOnMessage: boolean;
            }
        }
    }
}

export {};