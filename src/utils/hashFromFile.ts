import { readFileSync } from 'fs';
import { createHash } from 'crypto';

export default function hashFromFile(path: string) {
    const buffer = readFileSync(path);

    return createHash('sha256')
        .update(buffer)
        .digest('hex');
}