import { useEffect, useState, useCallback } from 'react';

import { useAccessSetup } from '@context/AccessSetup';
import { useSocket } from '@context/Socket';

import { FunctionDef } from '.';

import axios from 'axios';
import UI from '@components/ui';

import Prompt from '@components/Prompt';
import pickRandom from '@utils/array/pickRandom';

const SetBackground = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [fileList, setFileList] = useState<string[]>([]);
    const [src, setSrc] = useState<string>('');
    
    const socket = useSocket();
    const accessSetup = useAccessSetup();

    const hasAccess = useAccessSetup()?.functions?.setBackground;
    const sid = accessSetup?.shareLink?.id;
    const jwt = accessSetup?.jwt;

    const fetchFiles = useCallback(() => {
        axios.get('/medialist?glob=*.{jpg,jpeg,png}', {
            headers: {
                Authorization: `Bearer ${jwt}`,
                sid
            }
        }).then(res => {
            setFileList(res.data);
        });
    }, [sid, jwt]);

    useEffect(() => {
        if (!hasAccess) return;
        fetchFiles();
    }, [hasAccess, fetchFiles]);

    if (!hasAccess) return null;

    return <FunctionDef
        name="setBackground"
        parseArg={() => [src]}
        validate={form => {
            if (!form.src?.length) return { src: 'Required' }
        }}
        onClick={() => setOpen(true)}
    >
        Set wallpaper
        <Prompt
            title="Change wallpaper"
            formId="set-background"
            open={open}
            onClose={() => setOpen(false)}
            onAction={(action, form) => {
                action === 'confirm' && socket.emit('function', 'setBackground', [src]);
            }}
            actions={[
                {
                    name: 'cancel',
                    label: 'Cancel'
                },

                {
                    name: 'confirm',
                    label: 'Set background',
                    requiresValid: true
                }
            ]}
            validate={() => src? true: { src: 'Required' }}
        >
            <UI.Stack>
                <UI.Field
                    name="src"
                    type="select"
                    options={fileList.map(src => ({
                        value: src,
                        label: src
                    }))}
                    label="Source image"
                    value={src}
                    onChange={v => setSrc(v)}
                    sx={{ width: '200px' }}
                />

                <UI.Button variant="outlined" onClick={() => {
                    setSrc(!fileList.length? '': pickRandom(fileList))
                }}>Random</UI.Button>
            </UI.Stack>

            <div>
                <UI.Button onClick={fetchFiles}>Refresh files</UI.Button>
                {src && <>
                    <p>Preview</p>
                    <br />
                    <img src={`/media/${src}`} width="100%" height="auto" />
                </>}
            </div>
        </Prompt>
    </FunctionDef>
}

export default SetBackground;