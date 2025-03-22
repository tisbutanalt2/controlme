import { useSettingsContext } from '.';
import randomUUID from 'v4-uuid';

import UI from '@components/ui';

import AddIcon from '@muii/Add';
import FolderIcon from '@muii/Folder';
import DeleteIcon from '@muii/DeleteForever';
import { FolderType } from 'enum';
//import EditIcon from '@muii/Edit';

const maxPathLength = 96;

const Folder: FC <ControlMe.SharedFolder & {
    onFolderChange: (path: string) => void,
    onNameChange: (path: string) => void,
    onTypeChange: (type: FolderType) => void,
    onGlobChange: (glob: string) => void,
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
        <UI.Stack>
            <UI.Field
                type="select"
                value={props.type}
                label="Type"
                sx={{ minWidth: '120px' }}
                options={[
                    { value: FolderType.File, label: 'Files' },
                    { value: FolderType.Media, label: 'Media' },
                    { value: FolderType.Image, label: 'Images' },
                    { value: FolderType.Video, label: 'Videos' },
                    { value: FolderType.Audio, label: 'Audio' },
                    { value: FolderType.Custom, label: 'Custom' }
                ]}
                onChange={v => props.onTypeChange(v)}
            />

            {props.type === FolderType.Custom && <UI.Field
                type="text"
                value={props.glob}
                label="Glob Pattern"
                onChange={v => props.onGlobChange(v)}
                sx={{ minWidth: '160px' }}
            />}
        </UI.Stack>

        {props.type === FolderType.Custom && <UI.MUI.HelperText>
            Custom folders require a glob pattern to define which file types are allowed.    
        </UI.MUI.HelperText>}

        {props.type === FolderType.File && <UI.MUI.HelperText>
            File folders accept any type of file.
        </UI.MUI.HelperText>}

        {props.type === FolderType.Media && <UI.MUI.HelperText>
            Media folders accept images, videos and audio files.
        </UI.MUI.HelperText>}
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

        <h2>Shared Folders</h2>
        <UI.MUI.HelperText>
            You may set up custom folders to share to users.
            Folders will only be available to users you've
            explicitly given access. If you don't specify
            any users, the folder will be available to anyone
            with access to upload files of the given type.
        </UI.MUI.HelperText>

        {settings.folders?.map((folder, i) => <Folder
            key={i}
            {...folder}
            onFolderChange={v => {
                setSettings(prev => {
                    const copy = { ...prev, folders: [ ...prev.folders ] };
                    copy.folders[i].path = v;
                    return copy;
                });
            }}
            onNameChange={v => {
                setSettings(prev => {
                    const copy = { ...prev, folders: [ ...prev.folders ] };
                    copy.folders[i].name = v;
                    return copy;
                });
            }}
            onTypeChange={v => {
                setSettings(prev => {
                    const copy = { ...prev, folders: [ ...prev.folders ] };
                    copy.folders[i].type = v;
                    v !== FolderType.Custom && (copy.folders[i].glob = '');
                    return copy;
                });
            }}
            onGlobChange={v => {
                setSettings(prev => {
                    const copy = { ...prev, folders: [ ...prev.folders ] };
                    copy.folders[i].glob = v;
                    return copy;
                });
            }}
            onDelete={() => {
                setSettings(prev => {
                    const copy = { ...prev, folders: [ ...prev.folders ] };
                    copy.folders.splice(i, 1);
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
                        const copy = { ...prev, folders: [ ...prev.folders ] };
                        const folders = copy.folders ??= [];
                        folders.push({
                            ...res,
                            id: randomUUID(),
                            type: FolderType.Custom
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