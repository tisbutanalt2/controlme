declare global {
    namespace ControlMe {
        interface SharedFolder {
            id: string;
            type: import('enum').FolderType;
            
            name: string;
            path: string;

            /** glob pattern for Custom folders */
            glob?: string;

            /** Optional array of users who can see the folder */
            allowedUsers?: Array<string>;
        }

        type ReducedFolder = Pick<SharedFolder, 'id'|'type'|'name'|'glob'>;

        interface TargetFile {
            file: string;
            folder: string;
        }

        interface ShortFile {
            t: import('enum').FileType;
            f: string;
        }
    }
}

export {};