import type { TabProps } from '@components/Tabs';

export const isDev = process.env.NODE_ENV === 'development';
export const appTitle = 'Control Me!';

export const jwtExpirationTime = 60 * 60 * 24 * 3; // 3 days

export const maxDisplayNameLength = 128;

export const mainTabs: Array<TabProps> = [
    { value: '/', label: 'Main' },
    { value: '/chat', label: 'Chat' },
    { value: '/share', label: 'Share' },
    { value: '/settings', label: 'Settings' }
];

export const defaultSettings: ControlMe.Settings = {
    general: {
        disableWarnings: false,
        startMinimized: false,
        exitOnClose: true,
        launchOnStartup: false
    },

    appearance: {
        title: 'Control Me!',
        darkTheme: true
    },

    functions: {},

    files: {
        mediaFolders: [],
        fileFolders: []
    },

    security: {
        disablePanicKeybind: false,

        checkForBadHashes: true,
        disableAuth: false,

        approveAuth: true,
        alwaysApproveAuth: false,

        disableFutureRequests: false
    },

    server: {
        autoStart: true,
        notifyOnStart: true
    },

    ngrok: {
        autoStart: true
    },

    discord: {
        useCustomApplication: false
    },

    chat: {
        notifyOnMessage: true
    }
};

export const settingsTabs: Array<{ name: string; label: string }> = [
    { name: 'general', label: 'General' },
    { name: 'appearance', label: 'Appearance' },
    { name: 'functions', label: 'Functions' },
    { name: 'chat', label: 'Chat' },
    { name: 'webcam', label: 'Webcam' },
    { name: 'files', label: 'Files' },
    { name: 'security', label: 'Security' },
    { name: 'server', label: 'Server' },
    { name: 'ngrok', label: 'Ngrok' },
    { name: 'discord', label: 'Discord' },
    { name: 'about', label: 'About App' }
];

export const globPatterns = {
    image: '*.{jpg,jpeg,png,gif,webp,avif,svg,bmp}',
    video: '*.{mp4,webm,ogg}',
    audio: '*.{mp3,wav,ogg,aac,flac,opus,webm,m4a}'
} as const;