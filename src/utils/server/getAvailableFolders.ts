import configStore from '@stores/config';
import { FolderType } from 'enum';

import getFunctionAccess from './getFunctionAccess';

export default function getAvailableFolders(user?: Auth.User, folderType?: FolderType): Array<ControlMe.SharedFolder> {
    const access = getFunctionAccess(user.functionOverrides);

    const folders = configStore.get('folders') as Array<ControlMe.SharedFolder>;
    if (!(folders instanceof Array)) return [];

    const hasAnyFileAccess = access.has('uploadAnyFile');
    const hasMediaAccess = access.has('uploadMedia');

    const availableFolders = folders.filter(f => {
        if (Object.values(FolderType).includes(folderType) && f.type !== folderType) return false;
        if (!f.allowedUsers) {
            if (f.type === FolderType.File)
                return hasAnyFileAccess;

            if ([FolderType.Media, FolderType.Image, FolderType.Video, FolderType.Audio].includes(f.type))
                return hasMediaAccess;

            return false;
        }

        return f.allowedUsers.includes(user._key);
    });

    return availableFolders;
}