import { useCallback, useEffect, useMemo, useState } from 'react';
import { FileType, FolderType } from 'enum';

import { useConnection } from '@web/Connection';
import UI from '@components/ui';

export interface FileSelectProps {
    value?: ControlMe.TargetFile;
    selectedFolder?: string;
    title?: string;
    folderType?: FolderType | Array<FolderType>;
    fileType?: FileType | Array<FileType>;
    onChange?(v: ControlMe.TargetFile);
    onClose?(): void;
}

const maxItems = 32;

const FileSelect: FC<FileSelectProps> = props => {
    const connection = useConnection();

    const [page, setPage] = useState<number>(0);
    const [files, setFiles] = useState<Array<ControlMe.ShortFile>>([]);

    const folders = useMemo(() => {
        if (props.folderType === undefined) return connection.folders;
        const validTypes = (props.folderType instanceof Array) ? props.folderType : [props.folderType];

        return connection.folders.filter(f => validTypes.includes(f.type));
    }, [connection.folders]);

    useEffect(() => {
        if (!props.selectedFolder) return;
        connection.socket.emit('folderContents', props.selectedFolder, setFiles, page * maxItems, maxItems);
    }, [props.selectedFolder, page]);

    return <UI.MUI.Dialog open>
        <UI.MUI.DialogTitle>{props.title ?? 'Select file'}</UI.MUI.DialogTitle>
        <UI.MUI.DialogActions>
            <UI.Button>Cancel</UI.Button>
            <UI.Button>Select</UI.Button>
        </UI.MUI.DialogActions>
    </UI.MUI.Dialog>;
}

export default FileSelect;