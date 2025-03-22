import { shell } from 'electron';
import { DangerLevel, FieldType } from 'enum';

import { httpRegex } from '@utils/regex';

const openUrl: ControlMe.Function = {
    name: 'openUrl',
    dangerLevel: DangerLevel.Medium,

    title: 'Open URL',
    description: 'Opens a given URL in the default browser',

    parameters: [
        {
            name: 'url',
            type: FieldType.String,
            label: 'URL',
            required: true,
            sx: { minWidth: '240px' }
        }
    ],

    handler(props: { url: string }) {
        let url = props.url;
        if (!httpRegex.test(url)) url = `https://${url}`;

        shell.openExternal(url);
        return true;
    }
}

export default openUrl;