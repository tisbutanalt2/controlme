import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import context from '@main/context';
import { isDev } from 'const';

let writing = false;
export default function log(msg: any) {
    console.log(msg);
    if (isDev) return;

    if (writing) return console.warn('The previous message could not be stored in the log, due to the file already being written to.');
    writing = true;

    const path = join(context.logFolder, `${context.initTimestamp}.log`);
    const content = existsSync(path)? readFileSync(path, 'utf-8').toString(): '';

    const str = `[${new Date().toLocaleTimeString('en-uk')}]: ${String(msg)}`;
    
    try {
        writeFileSync(path, content.length? `\n${str}`:str, {
            flag: 'a'
        });
    } catch(err) { console.error(err) }

    writing = false;
}