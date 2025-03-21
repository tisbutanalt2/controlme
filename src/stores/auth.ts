import { app } from 'electron';
import Store from 'electron-store';

import { renameSync } from 'fs';
import { join } from 'path';

import log from 'log';
import sanitizeError from '@utils/sanitizeError';
import unixTimestamp from '@utils/unixTimestamp';

import { randomBytes } from 'crypto';
import { ShareLinkType, UserType } from 'enum';

const functionOverrides = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            allow: { type: 'boolean' }
        }
    }
} as const;

export const userDef = {
    type: 'object',
    properties: {
        type: {
            type: 'number',
            enum: Object.values(UserType) as Array<number>
        },
        functionOverrides,

        displayName: { type: 'string' },

        lastLogin: { type: 'number' },
        lastLogout: { type: 'number' },

        // Login specific
        username: { type: 'string' },
        password: { type: 'string' },

        // Discord specific
        userId: { type: 'string' },
        avatar: { type: 'string' }
    },
    required: ['type', 'displayName']
} as const;

const createStore = () => new Store<Auth.Store>({
    name: 'auth',
    defaults: {
        secret: randomBytes(32).toString('hex'),
        users: {},
        shareLinks: {},
        approvedUsers: {}
    },
    schema: {
        secret: { type: 'string' },

        users: {
            type: 'object',
            patternProperties: {
                '.*': userDef as unknown
            }
        },

        shareLinks: {
            type: 'object',
            patternProperties: {
                '.*': {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'number',
                            enum: Object.values(ShareLinkType) as Array<number>
                        },

                        id: { type: 'string' },

                        maxUses: { type: 'number' },
                        uses: { type: 'number' },
                        expiration: { type: 'number' },

                        functionOverrides
                    },
                    required: ['type', 'id']
                }
            }
        },

        approvedUsers: {
            type: 'object',
            patternProperties: {
                '.*': {
                    type: 'object',
                    properties: {
                        _key: { type: 'string' },
                        expiration: { type: 'number' }
                    },
                    required: ['_key']
                }
            }
        }
    }
});

let authStore: Store<Auth.Store>;
try {
    authStore = createStore();
} catch(err) {
    log(`Failed to parse auth store: ${sanitizeError(err)}. Resetting store...`, 'error');
    const userDataPath = app.getPath('userData');
    renameSync(join(userDataPath, 'auth.json'), join(userDataPath, `auth.backup.${unixTimestamp()}.json`));
    authStore = createStore();
}

export default authStore as Store<Auth.Store>;