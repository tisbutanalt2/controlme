import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import context from '@main/context';
import { isDev } from 'const';

import sanitizeError from '@utils/sanitizeError';

const resetColor = '\x1b[0m';
const infoColor = '\x1b[36m';
const warningColor = '\x1b[33m';
const errorColor = '\x1b[31m';

let writing = false;
export default function log(msg: any, logType: 'info'|'warning'|'error' = 'info', save: boolean = true) {
    logType === 'error' && (msg = sanitizeError(msg));
    
    const col = logType === 'info'
        ? infoColor
        : logType === 'warning'
        ? warningColor
        : errorColor;

    console.log(`${col}[${logType.toUpperCase()}]${resetColor}: ${String(msg)}`);
    if (isDev || !save) return;

    if (writing) return console.warn('The previous message could not be stored in the log, due to the file already being written to.');
    writing = true;

    const path = join(context.logFolder, `${context.initTimestamp}.log`);
    const content = existsSync(path)? readFileSync(path, 'utf-8').toString(): '';

    const str = `[${new Date().toLocaleTimeString('en-uk')} ${logType.toUpperCase()}]: ${String(msg)}`;
    
    try {
        writeFileSync(path, content.length? `\n${str}`:str, {
            flag: 'a'
        });
    } catch(err) { console.error(err) }

    writing = false;
}