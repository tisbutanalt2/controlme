import Store from 'electron-store';
import { randomBytes } from 'crypto';

const authStore = new Store<Auth.AuthStore>({ name: 'auth', defaults: {}});

export let secret = authStore.get('secret');
if (!secret) {
    secret = randomBytes(32).toString('hex');
    authStore.set('secret', secret);
}

export default authStore as Store<Auth.AuthStore>;