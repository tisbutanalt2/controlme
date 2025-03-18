import { useSettingsContext } from '.';
import randomUUID from 'v4-uuid';

import UI from '@components/ui';

import AddIcon from '@muii/Add';
import FolderIcon from '@muii/Folder';
import DeleteIcon from '@muii/DeleteForever';
import EditIcon from '@muii/Edit';

const maxPathLength = 96;

const Folder: FC <ControlMe.SharedFolder & {
    onFolderChange: (path: string) => void,
    onNameChange: (path: string) => void,
    onDelete: () => void
}> = props => {
    if (!props.path) return null;

    const path = props.path.length > maxPathLength
        ? `...${props.path.substring(props.path.length - (maxPathLength - 1), props.path.length)}`
        : props.path;

    return <>
        <UI.MUI.Tooltip title="Open Folder" placement="top" arrow>
            <UI.MUI.HelperText
                sx={{ mt: '12px', textDecoration: 'underline', cursor: 'pointer', width: 'fit-content' }}
                onClick={() => {
                    window.ipcMain.openFolder(props.path);
                }}
            >{String(path)}</UI.MUI.HelperText>
        </UI.MUI.Tooltip>

        <UI.Stack mt="8px" gap="4px">
            <UI.MUI.TextField
                label="Name"
                value={props.name}
                sx={{
                    width: '260px',
                    minWidth: '160px'
                }}
                onChange={e => props.onNameChange(e.target.value)}
            />

            <UI.MUI.Tooltip title="Change Folder" arrow>
                <UI.MUI.IconButton
                    onClick={() => {
                        window.ipcMain.selectFolder().then(res => {
                            if (!res) return;
                            props.onFolderChange(res.path)
                        })
                    }}
                >
                    <FolderIcon />
                </UI.MUI.IconButton>
            </UI.MUI.Tooltip>

            <UI.MUI.Tooltip title="Delete Folder" arrow>
                <UI.MUI.IconButton
                    color="error"
                    onClick={props.onDelete}
                >
                    <DeleteIcon />
                </UI.MUI.IconButton>
            </UI.MUI.Tooltip>
        </UI.Stack>
    </>
}

const FileSettings = () => {
    const [settings, setSettings] = useSettingsContext();

    return <>
        <UI.MUI.HelperText>
            You may share multiple folders to keep yourself organized.
            In the future, you will be able to choose which folders
            are available to who.

            <br />
            <br />

            The default folders will only be available if the user has access to send files/media.
        </UI.MUI.HelperText>

        <UI.Stack mt="8px">
            <UI.Button
                color="warning"
                onClick={window.ipcMain.openFileFolder}
            >Default File Folder</UI.Button>

            <UI.Button
                color="primary"
                onClick={window.ipcMain.openMediaFolder}
            >Default Media Folder</UI.Button>
        </UI.Stack>

        <h2>Custom File Folders</h2>
        <UI.MUI.HelperText>
            File folders accept any type of file. They will only be
            available to a user if they have access to upload any file.
        </UI.MUI.HelperText>

        {settings.files.fileFolders?.map((folder, i) => <Folder
            key={i}
            id={folder.id}
            name={folder.name}
            path={folder.path}
            allowedUsers={folder.allowedUsers}
            onFolderChange={v => {
                setSettings(prev => {
                    const copy = { ...prev, files: { ...prev.files } };
                    copy.files.fileFolders[i].path = v;
                    return copy;
                })
            }}
            onNameChange={v => {
                setSettings(prev => {
                    const copy = { ...prev, files: { ...prev.files } };
                    copy.files.fileFolders[i].name = v;
                    return copy;
                })
            }}
            onDelete={() => {
                setSettings(prev => {
                    const copy = { ...prev, files: { ...prev.files }};
                    copy.files.fileFolders.splice(i, 1);
                    return copy;
                })
            }}
        />)}

        <UI.Button
            variant="outlined"
            color="success"
            sx={{
                mt: '8px'
            }}
            onClick={() => {
                window.ipcMain.selectFolder().then(res => {
                    if (!res) return;
                    
                    setSettings(prev => {
                        const copy = { ...prev, files: { ...prev.files } };
                        const folders = copy.files.fileFolders ??= [];
                        folders.push({
                            ...res,
                            id: randomUUID()
                        });
                        return copy;
                    });
                })
            }}
        >
            <AddIcon />
        </UI.Button>

        <h2>Custom Media Folders</h2>
        <UI.MUI.HelperText>
            Media folders only accept images, videos and audio files. They will only be
            available to a user if they have access to upload media.
        </UI.MUI.HelperText>

        {settings.files.mediaFolders?.map((folder, i) => <Folder
            key={i}
            id={folder.id}
            name={folder.name}
            path={folder.path}
            allowedUsers={folder.allowedUsers}
            onFolderChange={v => {
                setSettings(prev => {
                    const copy = { ...prev, files: { ...prev.files } };
                    copy.files.mediaFolders[i].path = v;
                    return copy;
                })
            }}
            onNameChange={v => {
                setSettings(prev => {
                    const copy = { ...prev, files: { ...prev.files } };
                    copy.files.mediaFolders[i].name = v;
                    return copy;
                })
            }}
            onDelete={() => {
                setSettings(prev => {
                    const copy = { ...prev, files: { ...prev.files }};
                    copy.files.mediaFolders.splice(i, 1);
                    return copy;
                })
            }}
        />)}

        <UI.Button
            variant="outlined"
            color="success"
            sx={{
                mt: '8px'
            }}
            onClick={() => {
                window.ipcMain.selectFolder().then(res => {
                    if (!res) return;
                    
                    setSettings(prev => {
                        const copy = { ...prev, files: { ...prev.files } };
                        const folders = copy.files.mediaFolders ??= [];
                        folders.push({
                            ...res,
                            id: randomUUID()
                        });
                        return copy;
                    });
                })
            }}
        >
            <AddIcon />
        </UI.Button>
    </>
}

export default FileSettings;