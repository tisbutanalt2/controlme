export const appTitle = 'Control Me!';
export const isDev = process.env.NODE_ENV === 'development';

export const defaultSettings: ControlMe.Settings = {
    general: {
        disableWarnings: false,

        startMinimized: false,
        exitOnClose: true,

        launchOnStartup: false
    },

    appearance: {
        darkTheme: true
    },

    files: {
        shareAll: false,
        mediaFolders: [],
        fileFolders: [],

        maxSizeBytes: 0,
        maxSizeUnit: 'gb',

        maxMediaUploads: 0,
        maxFileUploads: 0
    },

    functions: {
        setBackground: true,
        imagePopups: true,
        videoPopups: true,
        writingPrompt: true,
        playAudio: true,
        fullscreenPopups: false,
        persistentPopups: false,
        uploadMedia: false,
        uploadFiles: false,
        accessCamera: false,
        runCommands: false,
        autoRunExe: false,
        openLinks: false,
        screenshot: false
    },

    webcam: {

    },

    security: {
        disablePanicKeybind: false,
        disableAuth: false
    },

    server: {
        port: 0,
        autoStart: true,
        notification: true,
        address: ''
    },

    ngrok: {
        autoStart: false
    }
};

interface Tab {
    name: string;
    label: string;
    hideInTabs?: boolean;
}

export const tabs: Tab[] = [
    { name: 'main', label: 'Main' },
    //{ name: 'chat', label: 'Chat' },
    { name: 'share', label: 'Share' },
    { name: 'settings', label: 'Settings' },
    { name: 'about', label: 'About', hideInTabs: true }
];

export const settingsTabs: Tab[] = [
    { name: 'general', label: 'General' },
    { name: 'appearance', label: 'Appearance' },
    { name: 'functions', label: 'Functions' },
    { name: 'webcam', label: 'Webcam' },
    { name: 'files', label: 'Files' },
    { name: 'security', label: 'Security' },
    { name: 'server', label: 'Server' },
    { name: 'ngrok', label: 'Ngrok' },
    { name: 'about', label: 'About App' }
];