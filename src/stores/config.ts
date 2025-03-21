import { app } from 'electron';
import Store from 'electron-store';

import { renameSync } from 'fs';
import { join } from 'path';

import { defaultSettings } from 'const';

import log from 'log';
import sanitizeError from '@utils/sanitizeError';
import unixTimestamp from '@utils/unixTimestamp';

const sharedFolder = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        path: { type: 'string' },
        id: { type: 'string' }
    },
    required: ['path', 'id'],
    additionalProperties: false
} as const;

const createStore = () => new Store<ControlMe.Settings>({
    name: 'config',
    watch: true,
    defaults: defaultSettings,
    schema: {
        general: {
            type: 'object',
            properties: {
                disableWarnings: { type: 'boolean' },

                startMinimized: { type: 'boolean' },
                exitOnClose: { type: 'boolean' },

                launchOnStartup: { type: 'boolean' }
            },
            required: [
                'disableWarnings',
                'startMinimized',
                'exitOnClose',
                'launchOnStartup'
            ]
        },

        appearance: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                darkTheme: { type: 'boolean' }
            },
            required: ['darkTheme']
        },

        functions: {
            type: 'object',
            patternProperties: {
                '.*': {
                    type: 'object',
                    properties: {
                        enabled: { type: 'boolean' }
                    },
                    additionalProperties: {
                        oneOf: [
                            { type: 'string' },
                            { type: 'number' },
                            { type: 'boolean' },
                            { type: 'object' }
                        ]
                    },
                    required: ['enabled']
                }
            }
        },

        webcamDevice: { type: 'string' },

        files: {
            type: 'object',
            properties: {
                mediaFolders: {
                    type: 'array',
                    items: sharedFolder as unknown
                },
                fileFolders: {
                    type: 'array',
                    items: sharedFolder as unknown
                }
            },
            required: ['mediaFolders', 'fileFolders']
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
            },
            required: [
                'disablePanicKeybind',
                
                'checkForBadHashes',
                'disableAuth',

                'approveAuth',
                'alwaysApproveAuth',

                'disableFutureRequests'
            ]
        },

        server: {
            type: 'object',
            properties: {
                port: { type: 'number' },
                autoStart: { type: 'boolean' },
                notifyOnStart: { type: 'boolean' },
                address: { type: 'string' }
            },
            required: [
                'autoStart',
                'notifyOnStart'
            ]
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
                        },
                        required: ['authToken']
                    }
                }
            },
            required: [
                'autoStart'
            ]
        },

        discord: {
            type: 'object',
            properties: {
                useCustomApplication: { type: 'boolean' },
                applicationId: { type: 'string' },
                applicationSecret: { type: 'string' }
            },
            required: [
                'useCustomApplication'
            ]
        },

        chat: {
            type: 'object',
            properties: {
                notifyOnMessage: { type: 'boolean' },
                maxMessageCount: { type: 'number' }
            },
            required: [
                'notifyOnMessage'
            ]
        }
    }
});

let configStore: Store<ControlMe.Settings>;
try {
    configStore = createStore();
} catch(err) {
    log(`Failed to parse config store: ${sanitizeError(err)}. Resetting store...`, 'error');
    const userDataPath = app.getPath('userData');
    renameSync(join(userDataPath, 'config.json'), join(userDataPath, `config.backup.${unixTimestamp()}.json`));
    configStore = createStore();
}

export default configStore;