import { useCallback, useEffect, useMemo, useState } from 'react';
import { FileType, FolderType } from 'enum';

import { useConnection } from '@web/Connection';
import UI from '@components/ui';

import FileIcon from '@muii/InsertDriveFile';
import ImageIcon from '@muii/Image';
import VideoIcon from '@muii/VideoFile';
import AudioIcon from '@muii/AudioFile';
import DownloadIcon from '@muii/Download';

import LeftArrowIcon from '@muii/ArrowBack';
import RightArrowIcon from '@muii/ArrowForward';

export interface FileSelectProps {
    value?: ControlMe.TargetFile;
    selectedFolder?: string;
    title?: string;
    label?: string;
    folderType?: FolderType | Array<FolderType>;
    fileType?: FileType | Array<FileType>;
    onChange?(v: ControlMe.TargetFile);
    onClose?(): void;
}

const maxItems = 32;

const FileSelect: FC<FileSelectProps & { open?: boolean }> = props => {
    const connection = useConnection();
    const [value, setValue] = useState<ControlMe.ShortFile|undefined>();
    const [selectedFolder, setSelectedFolder] = useState<string|undefined>(props.value?.folder);
    const [fetching, setFetching] = useState<boolean>(false);

    const [page, setPage] = useState<number>(0);
    const [files, setFiles] = useState<Array<ControlMe.ShortFile>>([]);

    const folders = useMemo(() => {
        if (props.folderType === undefined) return connection.folders;
        const validTypes = (props.folderType instanceof Array) ? props.folderType : [props.folderType];

        return connection.folders.filter(f => validTypes.includes(f.type));
    }, [connection.folders]);

    const changePage = useCallback((v: number) => {
        if ((page + v < 0) || !files.length || fetching) return;
        setFetching(true);

        setPage(prev => {
            const newValue = prev + v;

            connection.socket.emit('folderContents', selectedFolder, props.fileType, newValue * maxItems, maxItems, contents => {
                setFiles(props.fileType ? contents.filter(f => f.t === props.fileType) : contents);
                setFetching(false);
            });

            return newValue;
        });
    }, [files, page, props.fileType, maxItems, selectedFolder, fetching]);

    const changeFolder = useCallback((v: string) => {
        if (fetching) return;
        setFetching(true);

        setSelectedFolder(prev => {
            if (prev === v) {
                setFetching(false);
                return prev;
            };

            connection.socket.emit('folderContents', v, props.fileType, page * maxItems, maxItems, contents => {
                setFiles(props.fileType ? contents.filter(f => f.t === props.fileType) : contents);
                setFetching(false);
            });

            return v;
        });
    }, [fetching, connection, props.fileType]);

    return <UI.MUI.Dialog
        open={props.open}
        onClose={props.onClose}
        fullWidth
        maxWidth="lg"
    >
        <UI.MUI.DialogTitle>{props.title ?? 'Select file'}</UI.MUI.DialogTitle>

        <UI.MUI.DialogContent>
            <UI.Field
                type="select"
                label="Folder"
                disabled={fetching}
                options={folders.map(f => ({ value: f.id, label: f.name }))}
                onChange={v => changeFolder(v)}
                value={selectedFolder}
                sx={{ minWidth: '240px' }}
            />

            {!!files.length && <div className="file-select">
                <div className="left">
                    {!!files.length && <>
                        <UI.MUI.Divider sx={{ mt: '24px' }} />
                        <UI.MUI.MenuList className="files">
                            {files.map((file, i) => <UI.MUI.MenuItem
                                selected={value?.f === file.f}
                                key={i}
                                onClick={() => setValue(file)}
                            >
                                <UI.MUI.ListItemIcon>
                                    {file.t === FileType.Image
                                        ? <ImageIcon />
                                    : file.t === FileType.Generic
                                        ? <FileIcon />
                                    : file.t === FileType.Video
                                        ? <VideoIcon />
                                    : <AudioIcon />}
                                </UI.MUI.ListItemIcon>
                                {file.f}
                            </UI.MUI.MenuItem>)}
                        </UI.MUI.MenuList>

                        <UI.Stack className="pagination" justifyContent="center">
                            <UI.MUI.IconButton disabled={fetching || page === 0} onClick={() => changePage(-1)}>
                                <LeftArrowIcon />
                            </UI.MUI.IconButton>

                            <UI.MUI.HelperText>{page + 1}</UI.MUI.HelperText>

                            <UI.MUI.IconButton disabled={fetching || files.length < maxItems} onClick={() => changePage(1)}>
                                <RightArrowIcon />
                            </UI.MUI.IconButton>
                        </UI.Stack>
                    </>}
                </div>

                <div className="right">
                    {value?.f && <UI.Stack>
                        <UI.MUI.Tooltip title="Download File">
                            <UI.MUI.IconButton href={`/file/${selectedFolder}/${value.f}`} download>
                                <DownloadIcon />
                            </UI.MUI.IconButton>
                        </UI.MUI.Tooltip>
                        <UI.MUI.HelperText className="filename">{value.f}</UI.MUI.HelperText>
                    </UI.Stack>}

                    {[FileType.Image, FileType.Video, FileType.Audio].includes(value?.t) ? <div className="preview">
                        {value.t === FileType.Image && <img src={`/file/${selectedFolder}/${value.f}`} />}
                        {value.t === FileType.Video && <video src={`/file/${selectedFolder}/${value.f}`} />}
                        {value.t === FileType.Audio && <audio src={`/file/${selectedFolder}/${value.f}`} />}
                    </div> : <div className="nopreview">
                        <UI.MUI.HelperText>No preview is available</UI.MUI.HelperText>
                    </div>}
                </div>
            </div>}
        </UI.MUI.DialogContent>

        <UI.MUI.DialogActions>
            <UI.Button color="error" onClick={() => {
                props.onClose?.();
            }}>Cancel</UI.Button>
            <UI.Button color="success" onClick={() => {
                props.onClose?.();
                props.onChange?.({ folder: selectedFolder, file: value.f });
            }}>Confirm</UI.Button>
        </UI.MUI.DialogActions>
    </UI.MUI.Dialog>;
}

export const FileSelectButton: FC<FileSelectProps> = props => {
    const [open, setOpen] = useState<boolean>(false);

    return <>
        <UI.Stack mt="16px">
            <UI.Button onClick={() => setOpen(true)}>Select File</UI.Button>
            {props.label && <div>{props.label}</div>}
        </UI.Stack>

        {props.label && <UI.MUI.HelperText>Selected: {props.label}</UI.MUI.HelperText>}

        <FileSelect
            {...props}
            open={open}
            onClose={() => {
                setOpen(false);
                props.onClose?.();
            }}
        />
    </>
}

export default FileSelect;