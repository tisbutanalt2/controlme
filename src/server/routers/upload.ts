import { Router } from 'express';
import multer, { diskStorage } from 'multer';

import configStore from '@stores/config';
import { FolderType } from 'enum';

import requireFunctionAccess from '@utils/server/requireFunctionAccess';
import getAvailableFolders from '@utils/server/getAvailableFolders';
import hashFromFile from '@utils/hashFromFile';
import checkHashes from '@utils/server/checkHashes';

import { extname, join } from 'path';
import { existsSync, mkdirSync, rmSync } from 'fs';

import { folderMimeTypes } from 'const';
import { minimatch } from 'minimatch';

import fastFolderSize from 'fast-folder-size';
import log from 'log';
import userLabel from '@utils/string/userLabel';

let sizeOnDisk = 0;
const updateFolderSize = () => {
    const folders = configStore.get('folders');

    let cur = 0;
    folders.forEach((folder, i) => {
        fastFolderSize(folder.path, (err, bytes) => {
            !err && (cur += bytes);
            if (i === (folders.length - 1)) {
                sizeOnDisk = cur;
                log(`Total size of all folders: ${cur} bytes`, 'info', false);
            }
            i === (folders.length - 1) && (sizeOnDisk = cur);
        });
    });
}

updateFolderSize();
const uploadRouter = Router();

const storage = diskStorage({
    destination: (req, file, cb) => {
        const maxSize = Number(configStore.get('files.maxSizeBytes')) || 0;
        if (maxSize > 0 && (sizeOnDisk + file.size) >= maxSize) return cb(new Error('File size exceeds max storage size'), null);

        const type = req.body.type as FolderType;
        if (typeof type !== 'number' || type < 0) return cb(new Error('Invalid file type'), null);

        const folders = getAvailableFolders(req.user, type);

        // Find the folder
        const folder = folders.find(f => f.id === req.params.folder);
        if (!folder) return cb(new Error('Invalid folder ID'), null);

        if (!existsSync(folder.path)) mkdirSync(folder.path);

        // Check for mime types
        const mimeType = folderMimeTypes[folder.type];
        if (mimeType && !file.mimetype.startsWith(mimeType)) return cb(new Error('Invalid mime type'), null);

        // If the folder is custom, match the glob pattern
        if (folder.type === FolderType.Custom && folder.glob) {
            if (!minimatch(file.filename, folder.glob))
                return cb(new Error('Invalid file extension'), null);
        }

        cb(null, folder.path);
    },

    filename: (_req, file, cb) => {
        const ext = extname(file.originalname);
        let name = file.originalname.substring(0, file.originalname.length - ext.length);

        let success = false;
        let attempts = 0;
        while (
            !success &&
            attempts < 10 &&
            existsSync(
                join(file.destination, name)
            )
        ) {
            attempts++;
            name = file.originalname.substring(0, file.originalname.length - ext.length) + ` (${attempts})`;
            success = !existsSync(
                join(file.destination, name)
            );
        }

        success
            ? cb(null, `${name}${ext}`)
            : cb(new Error('Failed to create unique filename'), null)
    }
});

let upload = multer({
    storage,
    limits: {
        fileSize: configStore.get('files.maxSizeBytes') as number || undefined
    }
});

configStore.onDidChange('files.maxSizeBytes' as keyof ControlMe.Settings, (maxSize) => {
    upload = multer({
        storage,
        limits: {
            fileSize: Number(maxSize) || undefined
        }
    });
});

uploadRouter.post(
    '/upload/:folder',
    requireFunctionAccess('uploadFiles'),
    (req, res, next) => {
        const type = req.body.type as FolderType;
        if (typeof type !== 'number' || type < 0) throw 'Invalid file type';

        const folders = getAvailableFolders(req.user, type);

        const folder = folders.find(f => f.id === req.params.folder);
        if (!folder) throw 'Invalid folder ID';

        return upload.array('files', configStore.get('files.maxUploadCount') || undefined)(req, res, next);
    },
    async (req, res) => {
        const files: Array<Express.Multer.File> = req.files?.length === 1
            ? [req.files[0]]
            : req.files as Express.Multer.File[];

        const fileNames = files.map(file => {
            sizeOnDisk += file.size;
            return file.filename;
        });

        const shouldCheckHashes = Boolean(configStore.get('security.checkForBadHashes'));

        let badFilesDetected = 0;
        if (shouldCheckHashes) {
            const hashes = files.map(file => hashFromFile(file.path));
            badFilesDetected = await checkHashes(hashes);
        }

        if (badFilesDetected > 0) {
            log(`One or more malicious files were uploaded by ${userLabel(req.user)}. Deleting all files in the upload...`, 'warning');
            files.forEach(file => {
                rmSync(file.path, { maxRetries: 10, retryDelay: 100, force: true });
            });

            return res.status(400).send('One or more files were marked as malicious');
        }

        log(`${fileNames.length} files were uploaded by ${userLabel(req.user)}`);
        log(`Total size of all folders: ${sizeOnDisk} bytes`, 'info', false);

        res.json(fileNames);
    }
);

export default uploadRouter;