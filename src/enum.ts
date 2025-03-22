export enum UserType {
    Login = 0,
    Access = 1,
    Discord = 2
};

export enum DangerLevel {
    Low = 0,
    Medium = 1,
    High = 2
};

export enum FieldType {
    String = 0,
    Number = 1,
    Boolean = 2,
    Object = 3,
    Array = 4,
    File = 5
};

export enum ShareLinkType {
    /** Signup link */
    Signup = 0,

    /** Access through ID */
    Access = 1,

    /** Access through Discord authentication */
    Discord = 2
};

export enum ServerStatus {
    Closed = 0,
    Starting = 1,
    Open = 2,
    Error = 3
};

export enum PopupType {
    Image = 0,
    Video = 1,
    Audio = 2,
    Writing = 3 
};

// Used for shared folders
export enum FolderType {
    Custom = 0,
    File = 1,
    Media = 2,
    Image = 3,
    Video = 4,
    Audio = 5,
};

export enum FileType {
    Generic = 0,
    Image = 1,
    Video = 2,
    Audio = 3
};