import { useState, useEffect } from 'react';
import { useSettingsContext } from '.';

import TabForm from './TabForm';
import Field from '@components/Field';

import Button from '@muim/Button';
import Stack from '@muim/Stack';

import FormHelperText from '@muim/FormHelperText';

const unitSize = (unit?: string) => (
    unit === 'b'? 1:
    unit === 'mb'? 1_048_576:
    unit === 'gb'? 1_073_741_824:
    1
);

const FileSettings = () => {
    const [settings, setSettings] = useSettingsContext();
    const [maxSizeInput, setMaxSizeInput] = useState<number>((settings?.files?.maxSizeBytes ?? 0) / unitSize(settings?.files?.maxSizeUnit));
    
    const unit = settings?.files?.maxSizeUnit;
    useEffect(() => {
        const maxSize = maxSizeInput * unitSize(unit);
        if (maxSize !== settings?.files?.maxSizeBytes) setSettings(prev => ({
            ...prev,
            files: {
                ...prev.files,
                maxSizeBytes: maxSize
            }
        }));
    }, [unit]);

    return <>
        <Button
            variant="outlined"
            onClick={window.ipc.openFileFolder}
            sx={{ mb: '24px' }}
        >Open uploaded files</Button>
        
        <TabForm id="settings-functions" name="files">
            <Stack direction="row" gap="8px">
                <Field
                    name="maxSizeBytes"
                    type="number"
                    label="Folder size limit"
                    defaultValue={0}
                    min={0}
                    sx={{ minWidth: '60px', width: '140px' }}
                    value={maxSizeInput}
                    onChange={(k, v) => {
                        setMaxSizeInput(v);
                        setSettings(prev => ({
                            ...prev,
                            files: {
                                ...prev.files,
                                maxSizeBytes: v * unitSize(unit)
                            }
                        }))
                    }}
                />

                <Field
                    name="maxSizeUnit"
                    type="select"
                    label="Unit"
                    options={[
                        { value: 'b', label: 'Bytes' },
                        { value: 'mb', label: 'MB' },
                        { value: 'gb', label: 'GB' }
                    ]}
                    sx={{ width: '100px' }}
                />
            </Stack>

            <FormHelperText>Set the max amount of space the uploads folder can use, may exceed the size during singular large uploads, as the size is updated after the upload has finished</FormHelperText>

            <Field
                name="maxMediaUploads"
                type="number"
                label="Max media upload count"
                description="Limit how many media files can be uploaded at once, set to 0 for unlimited"
                defaultValue={0}
                sx={{ mt: '24px', width: '170px' }}
            />

            <Field
                name="maxFileUploads"
                type="number"
                label="Max file upload count"
                description="Limit how many files can be uploaded at once, set to 0 for unlimited"
                defaultValue={0}
                sx={{ mt: '12px', width: '170px' }}
            />
        </TabForm>
    </>
}

export default FileSettings;