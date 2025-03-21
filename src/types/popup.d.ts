declare global {
    namespace ControlMe {
        type Popup = {
            id?: string;
            type: import('enum').PopupType;

            /** Timeout in milliseconds before the popup disappears */
            timeout?: number;

            /** Whether or not the popup can be closed manually. Defaults to true. If audio: Displays an icon to click to stop it */
            closable?: boolean;

            /** True if the popup was called to a different window */
            isSub?: boolean;
        } & ({
            type: import('enum').PopupType.Image;
            src: string;

            /** Defined if src is from a shared folder */
            folderId?: string;
        } | {
            type: import('enum').PopupType.Video;
            src: string;

            /** Defined if src is from a shared folder */
            folderId?: string;
        } | {
            type: import('enum').PopupType.Audio;
            src: string;

            /** Defined if src is from a shared folder */
            folderId?: string;

            /** Custom close icon */
            iconSrc?: string;

            /** Defined if src is from a shared folder */
            iconFolderId?: string;
        } | {
            type: import('enum').PopupType.Writing;
            prompt: string;
            message?: string;
            blackScreen?: boolean;
        });
    }
}

export {};