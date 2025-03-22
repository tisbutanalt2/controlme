import { join } from 'path';
import { rmSync, statSync } from 'fs';

import context from 'ctx';

import { Router } from 'express';
import requireLoggedIn from '@utils/server/requireLoggedIn';

import getAvailableFolders from '@utils/server/getAvailableFolders';
import getFolderContents from '@utils/server/getFolderContents';
import { FileType, FolderType } from 'enum';

import { fileRegex } from '@utils/regex';

const fileRouter = Router();

fileRouter.get('/folders', requireLoggedIn(true, true), (req, res) => {
    const folderType = parseInt((req.query.type ?? '') as string) as FolderType|undefined;
    const availableFolders = getAvailableFolders(req.user, folderType);

    res.json(availableFolders.map(f => ({
        id: f.id,
        name: f.name,
        type: f.type,
        glob: f.glob
    } as ControlMe.ReducedFolder)));
});

fileRouter.get('/folder/:folder', requireLoggedIn(true, true), (req, res) => {
    const availableFolders = getAvailableFolders(req.user);

    const offset = Math.max(parseInt(String(req.query.offset)) || 0, 0);
    const max = Math.max(parseInt(String(req.query.maxItems)) || 32, 100);

    const fileType = parseInt(String(req.query.fileType)) as FileType;
    const hasFileType = Object.values(FileType).includes(fileType);
    
    const folder = availableFolders.find(f => f.id === req.params.folder);
    if (!folder) throw 'Invalid folder ID';

    let contents = getFolderContents(folder.path);
    if (hasFileType) contents = contents.filter(f => f.t === fileType);

    res.json(contents.slice(offset, offset + max));
});

fileRouter.get('/file/:folder/:name', requireLoggedIn(true, true), (req, res) => {
    const availableFolders = getAvailableFolders(req.user);

    const folder = availableFolders.find(f => f.id === req.params.folder);
    if (!folder) throw 'Invalid folder ID';

    const name = String(req.params.name);
    if (!name || !fileRegex.test(name)) throw 'Invalid filename';

    const filePath = join(folder.path, name);

    try {
        const stat = statSync(filePath);
        if (!stat.isFile()) throw 'Target was not a file';

        res.sendFile(filePath);
    } catch {
        throw 'Failed to read file';
    }
});

fileRouter.get('/tempfile/:file', requireLoggedIn(true, true), (req, res) => {
    const name = String(req.params.file);
    if (!name || !fileRegex.test(name)) throw 'Invalid filename';

    const filePath = join(context.tempFolder, name);

    try {
        const stat = statSync(filePath);
        if (!stat.isFile()) throw 'Target was not a file';

        res.sendFile(filePath, () => {
            try {
                rmSync(filePath);
            } catch {}
        });
    } catch {
        throw 'Failed to read file';
    }
});

export default fileRouter;