import { userInfo } from 'os';

export default function sanitizeError(err: string) {
    return err.replace(userInfo().username, '[username]');
}