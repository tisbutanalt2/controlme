import { DangerLevel, FieldType, FileType, FolderType } from 'enum';
import targetFileToPath from '@utils/targetFileToPath';

const setWallpaper: ControlMe.Function<{ src: ControlMe.TargetFile }> = {
    name: 'setWallpaper',
    dangerLevel: DangerLevel.Low,

    title: 'Set Wallpaper',
    description: 'Allow users to change the desktop wallpaper',
    userDescription: 'Changes the desktop wallpaper',

    parameters: [
        {
            name: 'src',
            type: FieldType.File,
            required: true,
            fileType: FileType.Image,
            folderType: [FolderType.Image, FolderType.Media],
            label: 'Image'
        }
    ],

    async handler(props) {
        if (!props.src.file || !props.src.folder)
            throw new Error('File or folder is missing');

        const src = targetFileToPath(props.src);

        // Fuck you TSC
        const wp = await (eval("import('wallpaper')") as Promise<typeof import('wallpaper')>);
        await wp.setWallpaper(src, {
            scale: 'tile',
            screen: 'all'
        });
        return { success: true };
    }
}

export default setWallpaper;