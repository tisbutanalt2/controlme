import { useState, useCallback, useRef } from 'react';

import { useSocket } from '@context/Socket';
import { useAccessSetup } from '@context/AccessSetup';
import { useWebErrorState } from '@context/WebError';

import axios, { AxiosError } from 'axios';

import { FunctionDef } from '.';

import Button from '@muim/Button';
import Stack from '@muim/Stack';

const UploadMedia = () => {
    const socket = useSocket();
    const accessSetup = useAccessSetup();
    const [,setError] = useWebErrorState();

    const [files, setFiles] = useState<FileList|null>(null);
    const [buttonTimeout, setButtonTimeout] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement|null>(null)

    const jwt = accessSetup?.jwt;
    const sid = accessSetup?.shareLink?.id;

    const upload = useCallback(() => {
        if (buttonTimeout) return;
        setButtonTimeout(true);

        const formData = new FormData();
        for (const file of files) {
            formData.append('files', file);
        }
        
        axios.post('/upload/media', formData, {
            headers: {
                "Content-Type": 'multipart/form-data',
                "Authorization": `Bearer ${accessSetup?.jwt ?? ''}`,
                sid: accessSetup?.shareLink?.id
            }
        }).then(res => {
            console.log(res.data);
            setTimeout(() => {
                setFiles(null);
                inputRef.current && (inputRef.current.value = '');
                setButtonTimeout(false);
            }, 1000);
        }).catch((err: AxiosError) => {
            console.log(err);
            setError(String(err.response?.data || 'Failed to upload media'));
        });
    }, [files, jwt, sid, buttonTimeout, inputRef]);

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(e.target.files);
    }, []);

    if (!socket) return null;

    return <FunctionDef
        name="uploadMedia"
        customHandler={() => upload()}
        button={<Button color="success" variant="outlined" disabled={buttonTimeout} onClick={upload}>Submit</Button>}
    >
        <Stack direction="row" alignItems="center">
            <Stack direction="column">
                <div>Upload media</div>
                <div>({files?.length ?? 0} selected)</div>
            </Stack>
            <Button
                    component="label"
                    variant="outlined"
                    sx={{ mx: '12px', ml: 'auto' }}
                >
                Select files
                <input ref={inputRef} hidden name="files" type="file" accept="image/*,video/*,audio/*,.gif" multiple onChange={onChange} />
            </Button>
        </Stack>
    </FunctionDef>
}

export default UploadMedia;