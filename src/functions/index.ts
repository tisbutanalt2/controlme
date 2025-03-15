import { shell } from 'electron';
import { spawn } from 'child_process';

import setBackground from './setBackground';
import screenshot from './screenshot';
import webcamImage from './webcamImage';
import imagePopup from './imagePopup';

const functions: { [K in keyof Partial<ControlMe.Functions>]: (...args: any[]) => PromiseLike<any>|void } = {
    setBackground,
    screenshot,
    openLinks: (links: string|string[]) => (links instanceof Array? links: [links]).forEach(url => {
        if (!/^https?:\/\//.test(url)) throw new Error('Links have to follow the standard URL format (http://)');
        shell.openExternal(url);
    }),
    accessCamera: webcamImage,
    imagePopups: imagePopup,
    runCommands: (cmd: string) => {
        const sub = spawn(cmd, { shell: true });
        sub.stdout.pipe(process.stdout);
        sub.stderr.pipe(process.stderr);
    }
};

export default functions;