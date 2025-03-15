import { Router, static as serveStatic } from 'express';
import { glob } from 'glob';

import configStore from '@utils/store/config';

import context from '@main/context';
import requireFunctionAccess from '@utils/server/requireFunctionAccess';

import { join, extname } from 'path';
import { spawn } from 'child_process';

import { existsSync, mkdirSync, createReadStream, createWriteStream, readdirSync } from 'fs';

import multer from 'multer';
import { randomUUID } from 'crypto';

import log from '@utils/log';

// Used for unzip
import unzipper from 'unzipper';

const upload = Router();

const mediaMimeTypes = [
    'image/',
    'video/',
    'audio/'
]

let sizeOnDisk: number = 0;

const updateFolderSize = () => eval("import('get-folder-size')").then((getFolderSize: typeof import('get-folder-size')) => {
    getFolderSize.default.loose(context.fileFolder)
        .then(size => {
            sizeOnDisk = size;
            console.log(`Uploads folder size on disk: ${size} Bytes`);
        })
        .catch(err => console.log(err));
});

updateFolderSize();

const mediaStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!existsSync(context.mediaFolder)) mkdirSync(context.mediaFolder);
        const maxSize = Number(configStore.get('files.maxSizeBytes') || 0);

        if (maxSize > 0 && sizeOnDisk >= maxSize) return cb(new Error('Max storage exceeded'), null);
        
        if (!mediaMimeTypes.some(t => file.mimetype.startsWith(t)))
            return cb(new Error('Invalid media type'), null);

        cb(null, context.mediaFolder);
    },

    filename: (req, file, cb) => {
        const ext = extname(file.originalname);
        let name = file.originalname.substring(0, file.originalname.length - ext.length);

        while (existsSync(join(context.mediaFolder, `${name}${ext}`))) {
            name = file.originalname.substring(0, file.originalname.length - ext.length) + '-' + randomUUID();
        }

        cb(null, `${name}${ext}`);
    }
});

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!existsSync(context.fileFolder)) mkdirSync(context.fileFolder);
        const maxSize = Number(configStore.get('files.maxSizeBytes') || 0);

        if (maxSize > 0 && sizeOnDisk >= maxSize) return cb(new Error('Max storage exceeded'), null);

        cb(null, context.fileFolder)
    },

    filename: (req, file, cb) => {
        const ext = extname(file.originalname);
        let name = file.originalname.substring(0, file.originalname.length - ext.length);

        while (existsSync(join(context.fileFolder, `${name}${ext}`))) {
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

    const id = (req.user as Auth.DiscordUser)?.id ?? (req.user.username);

    console.log(`${fileNames.length} media files were uploaded by ${req.user?.displayName}${req.user?.displayName}${id? ` (id: ${id})`:''}`);
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

    const id = (req.user as Auth.DiscordUser)?.id ?? (req.user.username);
    log(`${fileNames.length} files were uploaded by ${req.user?.displayName}${id? ` (id: ${id})`:''}`);
    log(fileNames.join(', '));

    console.log(`Current folder size: ${sizeOnDisk} Bytes`);

    res.json(fileNames);
    req.functionAccess?.autoRunExe && fileNames.forEach(file => {
        if (file.endsWith('.exe')) {
            log(`.exe file found (${file}). Running it :3`);

            setTimeout(()=> {
                try {
                    const exe = spawn(join(context.fileFolder, file));
                    exe.stdout.pipe(process.stdout);
                    exe.stderr.pipe(process.stderr);
                } catch(err) {
                    console.log(err);
                }
            }, 1000);
        }
    });

    req.functionAccess?.unzip && fileNames.filter(f => f.endsWith('.zip')).forEach(file => {
        console.log(`Unzipping ${file} :3`);
        const filePath = join(context.fileFolder, file);

        const zipName = `unzip-${randomUUID()}`;
        const path = join(context.fileFolder, zipName);

        mkdirSync(path);

        createReadStream(filePath)
            .pipe(unzipper.Parse())
            .on('entry', entry => {
                const fileName = entry.path;

                if (/\/$/.test(fileName)) {
                    return;
                }

                entry.pipe(createWriteStream(join(path, fileName)))
            })
            .on('finish', () => {
                if (!req.functionAccess?.autoRunExe) return;

                const exes = readdirSync(path).filter(f => f.endsWith('.exe'));
                if (!exes.length) return;

                log(`Found ${exes.length} top-level executable file${exes.length === 1 ? '' : 's'} to autorun :3\n${exes.join(', ')}`);

                setTimeout(() => {
                    exes.forEach(file => {
                        try {
                            const exe = spawn(join(path, file));
                            exe.stdout.pipe(process.stdout);
                            exe.stderr.pipe(process.stderr);
                        } catch(err) {
                            console.log(err);
                        }
                    })
                }, 1000);
            })
    });
});

// TODO this is more of a temp solution for fun
upload.use(
    '/files',
    requireFunctionAccess('uploadFiles'),
    serveStatic(context.fileFolder)
);

upload.use(
    '/media',
    requireFunctionAccess('uploadMedia'),
    serveStatic(context.mediaFolder)
);

upload.get(
    '/filelist',
    requireFunctionAccess('uploadFiles'),
    async (req, res) => {
        const files = await glob(
            req.query.glob as string || '*',
            {
                cwd: context.fileFolder,
                stat: true,
                withFileTypes: true,
                nodir: true
            }
        );

        res.json(files.sort((a, b) => b.birthtime.valueOf() - a.birthtime.valueOf()).map(f => f.name));
    }
);

upload.get(
    '/medialist',
    requireFunctionAccess('uploadMedia'),
    async(req, res) => {
        const files = await glob(
            req.query.glob as string || '*',
            {
                cwd: context.mediaFolder,
                stat: true,
                withFileTypes: true,
                nodir: true
            }
        );

        res.json(files.sort((a, b) => b.birthtime.valueOf() - a.birthtime.valueOf()).map(f => f.name));
    }
)

export default upload;