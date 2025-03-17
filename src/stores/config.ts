import { app } from 'electron';
import Store from 'electron-store';

import { rmSync } from 'fs';
import { join } from 'path';

import log from 'log';
import sanitizeError from '@utils/sanitizeError';

const sharedFolder = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        path: { type: 'string' }
    },
    additionalProperties: false
} as const;

const createStore = () => new Store<ControlMe.Settings>({
    name: 'config',
    watch: true,
    defaults: {
        general: {
            disableWarnings: false,
            startMinimized: false,
            exitOnClose: true,
            launchOnStartup: false
        },

        appearance: {
            title: 'Control Me!',
            darkTheme: true
        },

        functions: {},

        files: {
            mediaFolders: [],
            fileFolders: []
        },

        security: {
            disablePanicKeybind: false,

            checkForBadHashes: true,
            disableAuth: false,

            approveAuth: true,
            alwaysApproveAuth: false,

            disableFutureRequests: false
        },

        server: {
            autoStart: true,
            notifyOnStart: true
        },

        ngrok: {
            autoStart: true
        },

        discord: {
            useCustomApplication: false
        },

        chat: {
            notifyOnMessage: true
        }
    },
    schema: {
        general: {
            type: 'object',
            properties: {
                disableWarnings: { type: 'boolean' },

                startMinimized: { type: 'boolean' },
                exitOnClose: { type: 'boolean' },

                launchOnStartup: { type: 'boolean' }
            }
        },

        appearance: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                darkTheme: { type: 'boolean' }
            }
        },

        functions: {
            type: 'object',
            patternProperties: {
                '.*': { type: 'boolean' }
            }
        },

        webcamDevice: { type: 'string' },

        files: {
            type: 'object',
            properties: {
                mediaFolders: {
                    type: 'array',
                    items: sharedFolder
                },
                fileFolders: {
                    type: 'array',
                    items: sharedFolder
                }
            }
        },

        security: {
            type: 'object',
            properties: {
                disablePanicKeybind: { type: 'boolean' },

                checkForBadHashes: { type: 'boolean' },
                disableAuth: { type: 'boolean' },

                thirdPartyServer: { type: 'string' },

                approveAuth: { type: 'boolean' },
                alwaysApproveAuth: { type: 'boolean' },

                disableFutureRequests: { type: 'boolean' }
            }
        },

        server: {
            type: 'object',
            properties: {
                port: { type: 'number' },
                autoStart: { type: 'boolean' },
                notifyOnStart: { type: 'boolean' },
                address: { type: 'string' }
            }
        },

        ngrok: {
            type: 'object',
            properties: {
                autoStart: { type: 'boolean' },
                domain: { type: 'string' },
                authToken: { type: 'string' },

                fallbacks: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            domain: { type: 'string' },
                            authToken: { type: 'string' }
                        }
                    }
                }
            }
        },

        discord: {
            type: 'object',
            properties: {
                useCustomApplication: { type: 'boolean' },
                applicationId: { type: 'string' },
                applicationSecret: { type: 'string' }
            }
        },

        chat: {
            type: 'object',
            properties: {
                notifyOnMessage: { type: 'boolean' }
            }
        }
    }
});

let configStore: Store<ControlMe.Settings>;
try {
    configStore = createStore();
} catch(err) {
    log(`Failed to parse config store: ${sanitizeError(err)}. Deleting...`);
    rmSync(join(app.getPath('userData'), 'config.json'), { force: true });
    configStore = createStore();
}

export default configStore;