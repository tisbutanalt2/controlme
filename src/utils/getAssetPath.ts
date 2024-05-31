import { join } from 'path';
import { isDev } from './constants';

export default function getAssetPath(path: string) {
    return isDev
        ?join('assets', path)
        :join(process.resourcesPath, path)
}