import Store from 'electron-store';
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

const authStore = new Store<Auth.Store>({
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
                '.*': {
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
                }
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

export default authStore as Store<Auth.Store>;