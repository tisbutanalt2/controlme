import { join } from 'path';
import { statSync, readdirSync } from 'fs';

import {
    imageFileRegex,
    videoFileRegex,
    audioFileRegex
} from '@utils/regex';
import { FileType } from 'enum';

export default function getFolderContents(path: string): Array<ControlMe.ShortFile> {
    try {
        const dir = readdirSync(path);
        
        const files: Array<ControlMe.ShortFile> = dir.map(name => {
            try {
                const stat = statSync(join(path, name));
                if (stat.isFile()) {
                    if (imageFileRegex.test(name)) return { t: FileType.Image, f: name };
                    if (videoFileRegex.test(name)) return { t: FileType.Video, f: name };
                    if (audioFileRegex.test(name)) return { t: FileType.Audio, f: name };
                    return { t: FileType.Generic, f: name };
                }
            } catch {}
        }).filter(f => typeof f === 'object');

        return files;
    } catch {
        return [];
    }
}