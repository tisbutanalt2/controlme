import { app } from 'electron';
import Store from 'electron-store';

import { rmSync } from 'fs';
import { join } from 'path';

import { userDef } from './auth';

import log from 'log';
import sanitizeError from '@utils/sanitizeError';

const createStore = () => new Store<ControlMe.Chat.Store>({
    defaults: {
        messages: []
    },
    schema: {
        messages: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    content: { type: 'string' },
                    isHost: { type: 'boolean' },
                    user: userDef as unknown
                },
                required: ['id', 'content']
            }
        }
    }
});

let chatStore: Store<ControlMe.Chat.Store>;
try {
    chatStore = createStore();
} catch(err) {
    log(`Failed to parse chat store: ${sanitizeError(err)}. Deleting...`); // TODO move instead?
    rmSync(join(app.getPath('userData'), 'auth.json'), { force: true });
    chatStore = createStore();
}

export default chatStore as Store<ControlMe.Chat.Store>;