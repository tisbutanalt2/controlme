import { app } from 'electron';
import Store from 'electron-store';

import { rmSync } from 'fs';
import { join } from 'path';

import log from 'log';
import sanitizeError from '@utils/sanitizeError';

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
        shareLinks: {}
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
        }
    }
});

let authStore: Store<Auth.Store>;
try {
    authStore = createStore();
} catch(err) {
    log(`Failed to parse auth store: ${sanitizeError(err)}. Deleting...`); // TODO move instead?
    rmSync(join(app.getPath('userData'), 'auth.json'), { force: true });
    authStore = createStore();
}

export default authStore as Store<Auth.Store>;