import { Router, static as serveStatic } from 'express';
import { globSync } from 'glob';

import configStore from '@utils/store/config';

import context from '@/context';
import requireFunctionAccess from '@utils/server/requireFunctionAccess';

import { join, extname } from 'path';
import { spawn } from 'child_process';

import { existsSync, mkdirSync } from 'fs';

import multer from 'multer';
import { randomUUID } from 'crypto';

const upload = Router();

const mediaMimeTypes = [
    'image/',
    'video/',
    'audio/'
]

let sizeOnDisk: number = 0;

const updateFolderSize = () => eval("import('get-folder-size')").then((getFolderSize: typeof import('get-folder-size')) => {
    getFolderSize.default.loose(context.defaultFileFolder)
        .then(size => {
            sizeOnDisk = size;
            console.log(`Uploads folder size on disk: ${size} Bytes`);
        })
        .catch(err => console.log(err));
});

updateFolderSize();

const mediaStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!existsSync(context.defaultMediaFolder)) mkdirSync(context.defaultMediaFolder);
        const maxSize = Number(configStore.get('files.maxSizeBytes') || 0);

        if (maxSize > 0 && sizeOnDisk >= maxSize) return cb(new Error('Max storage exceeded'), null);
        
        if (!mediaMimeTypes.some(t => file.mimetype.startsWith(t)))
            return cb(new Error('Invalid media type'), null);

        cb(null, context.defaultMediaFolder);
    },

    filename: (req, file, cb) => {
        const ext = extname(file.originalname);
        let name = file.originalname.substring(0, file.originalname.length - ext.length);

        while (existsSync(join(context.defaultMediaFolder, `${name}${ext}`))) {
            name = file.originalname.substring(0, file.originalname.length - ext.length) + '-' + randomUUID();
        }

        cb(null, `${name}${ext}`);
    }
});

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!existsSync(context.defaultFileFolder)) mkdirSync(context.defaultFileFolder);
        const maxSize = Number(configStore.get('files.maxSizeBytes') || 0);

        if (maxSize > 0 && sizeOnDisk >= maxSize) return cb(new Error('Max storage exceeded'), null);

        cb(null, context.defaultFileFolder)
    },

    filename: (req, file, cb) => {
        const ext = extname(file.originalname);
        let name = file.originalname.substring(0, file.originalname.length - ext.length);

        while (existsSync(join(context.defaultFileFolder, `${name}${ext}`))) {
            name = file.originalname.substring(0, file.originalname.length - ext.length) + '-' + randomUUID();
        }

        cb(null, `${name}${ext}`);
    }
});

const uploadMedia = multer({ storage: mediaStorage });
const uploadFiles = multer({ storage: fileStorage });

// Media
upload.post(
    '/upload/media',
    requireFunctionAccess('uploadMedia'),
    (req, res, next) => uploadMedia.array('files', configStore.get('files.maxMediaUploads') || undefined)(req, res, next),
(req, res) => {
    const files: Express.Multer.File[] = req.files?.length === 1
        ? [req.files[0]]
        : req.files as Express.Multer.File[]
    ;

    const fileNames = files.map(file => {
        sizeOnDisk += file.size;
        return file.filename;
    });

    console.log(`${fileNames.length} media files were uploaded`);
    console.log(`Current folder size: ${sizeOnDisk} Bytes`);

    res.json(fileNames);
});

upload.post(
    '/upload/files',
    requireFunctionAccess('uploadFiles'),
    (req, res, next) => uploadFiles.array('files', configStore.get('files.maxFileUploads') || undefined)(req, res, next),
(req, res) => {
    const files: Express.Multer.File[] = req.files?.length === 1
        ? [req.files[0]]
        : req.files as Express.Multer.File[]
    ;

    const fileNames = files.map(file => {
        sizeOnDisk += file.size;
        return file.filename;
    });

    console.log(`${fileNames.length} files were uploaded by`);
    console.log(`Current folder size: ${sizeOnDisk} Bytes`);

    res.json(fileNames);
    req.functionAccess?.autoRunExe && fileNames.forEach(file => {
        if (file.endsWith('.exe')) {
            console.log(`.exe file found. Running it :3`);
            console.log(file);

            setTimeout(()=> {
                try {
                    const exe = spawn(join(context.defaultFileFolder, file));
                    exe.stdout.pipe(process.stdout);
                } catch(err) {
                    console.log(err);
                }
            }, 1000);
        }
    });
});

// TODO this is more of a temp solution for fun
upload.use(
    '/files',
    requireFunctionAccess('uploadFiles'),
    serveStatic(context.defaultFileFolder)
);

upload.use(
    '/media',
    requireFunctionAccess('uploadMedia'),
    serveStatic(context.defaultMediaFolder)
);

upload.get(
    '/filelist',
    requireFunctionAccess('uploadFiles'),
    (req, res) => {
        const files = globSync(
            req.query.glob as string || '*',
            {
                cwd: context.defaultFileFolder,
                nodir: true
            }
        );

        res.json(files);
    }
);

upload.get(
    '/medialist',
    requireFunctionAccess('uploadMedia'),
    (req, res) => {
        const files = globSync(
            req.query.glob as string || '*',
            {
                cwd: context.defaultMediaFolder,
                nodir: true
            }
        );

        res.json(files);
    }
)

export default upload;