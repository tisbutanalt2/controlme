import { join } from 'path';
import { pathToFileURL } from 'url';

import configStore from '@stores/config';

export default function targetFileToUrl(target: ControlMe.TargetFile) {
    if (!target.file || !target.folder)
        throw new Error('Target file or folder is missing');

    const folders = configStore.get('folders');
    
    const folder = folders?.find(f => f.id === target.folder);
    if (!folder) throw new Error('Target folder was not found');

    return pathToFileURL(
        join(folder.path, target.file)
    ).href;
}