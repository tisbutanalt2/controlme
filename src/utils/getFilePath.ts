import isDev from './isDev';
import { join } from 'path';

export default function getFilePath(devPath: string, prodPath: string, isResource: boolean = false) {
    return isDev
        ? devPath
        : (isResource
            ? join(process.resourcesPath, 'resources', prodPath)
            : join('./resources/app.asar', prodPath)
        )
}