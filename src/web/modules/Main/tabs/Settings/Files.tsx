import { useState, useEffect } from 'react';
import { useSettingsContext } from '.';

import TabForm from './TabForm';
import UI from '@components/ui';

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

    // TODO renovation
    return <>
        {<UI.Button
            variant="outlined"
            onClick={window.ipcMain.openFileFolder}
            sx={{ mb: '24px' }}
>Open uploaded files</UI.Button>}
        
        <TabForm id="settings-functions" name="files">
            <UI.Stack>
                <UI.Field
                    name="maxSizeBytes"
                    type="number"
                    label="Folder size limit"
                    defaultValue={0}
                    min={0}
                    sx={{ minWidth: '60px', width: '140px' }}
                    value={maxSizeInput}
                    onChange={v => {
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

                <UI.Field
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
            </UI.Stack>

            <UI.MUI.HelperText>Set the max amount of space the uploads folder can use, may exceed the size during singular large uploads, as the size is updated after the upload has finished</UI.MUI.HelperText>

            <UI.Field
                name="maxMediaUploads"
                type="number"
                label="Max media upload count"
                description="Limit how many media files can be uploaded at once, set to 0 for unlimited"
                defaultValue={0}
                sx={{ mt: '24px', width: '170px' }}
            />

            <UI.Field
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