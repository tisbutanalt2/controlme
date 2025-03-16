import { userInfo } from 'os';

export default function sanitizeError(err: unknown) {
    if (err instanceof Error) err = err.message;
    return String(err).replace(userInfo().username, 'USERNAME-REDACTED');
}