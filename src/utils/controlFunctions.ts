const controlFunctions = {
    setBackground: {
        title: 'Set background',
        description: 'Allows for your desktop wallpaper to be changed',
        categories: ['image']
    },

    imagePopups: {
        title: 'Image popups',
        description: 'Receive random image popups',
        categories: ['image', 'popups']
    },

    videoPopups: {
        title: 'Video popups',
        description: 'Receive random video popups'
    },

    writingPrompt: {
        title: 'Writing prompt',
        description: 'Receive writing prompts',
        categories: ['writing', 'prompt', 'popups']
    },

    openLinks: {
        title: 'Open URLs',
        description: 'Open links in your default browser',
        categories: ['popups', 'browser'],
        dangerous: true
    },

    fullscreenPopups: {
        title: 'Fullscreen popups',
        description: 'Receive popups that cover the entire screen',
        categories: ['image', 'video', 'popup'],
        dangerous: true,
        requires: ['imagePopups', 'videoPopups', 'writingPrompt']
    },
    
    persistentPopups: {
        title: 'Persistent popups',
        description: 'Receive popups and prompts that cannot be closed',
        categories: ['images', 'videos', 'popups'],
        dangerous: true,
        requires: ['imagePopups', 'videoPopups', 'writingPrompt']
    },
    
    playAudio: {
        title: 'Play audio',
        description: 'Play audio files in the background',
        categories: ['audio', 'popup']
    },

    uploadMedia: {
        title: 'Upload media',
        description: 'Receive media files, such as images, videos and audio',
        categories: ['image', 'video', 'audio', 'file', 'media'],
        dangerous: true
    },

    uploadFiles: {
        title: 'Upload any file',
        description: 'Receive any kind of file, even executables',
        categories: ['file', 'exe', 'cmd'],
        veryDangerous: true,
        dangerousMessage: 'This option means that you can receive harmful files and malware. Are you sure you want to enable it?'
    },

    autoRunExe: {
        title: 'Automatically open exe files',
        description: 'Automatically runs any uploaded executable file',
        categories: ['file', 'exe', 'cmd'],
        veryDangerous: true,
        requires: 'uploadFiles'
    },

    runCommands: {
        title: 'Run terminal commands',
        description: 'Run terminal commands as administrator',
        categories: ['exe', 'cmd'],
        veryDangerous: true,
        dangerousMessage: 'This option effectively gives full system access. Are you sure you want to enable it?'
    },

    accessCamera: {
        title: 'Access camera',
        description: 'Access your webcam',
        categories: ['video', 'camera', 'webcam'],
        dangerous: true
    },

    screenshot: {
        title: 'Take screenshots',
        description: 'Allows for your screen to be taken a screenshot of',
        categories: ['image', 'video'],
        dangerous: true
    }
} as const;

// Append 'name' to each function
for (const k in controlFunctions) {
    (controlFunctions[k] as ControlMe.FunctionDefinition).name = k;
}

export const sortedFunctions = Object
    .values(controlFunctions)
    .sort((a, b) => {
        const defA = a as unknown as ControlMe.FunctionDefinition;
        const defB = b as unknown as ControlMe.FunctionDefinition;

        const swap = (
            !(defA.veryDangerous && defB.dangerous) &&
            ((defB.dangerous && !defA.dangerous) ||
            (defB.veryDangerous && !defA.veryDangerous))
        )

        return swap? -1: 1;
    }) as ControlMe.FunctionDefinition[]

export default controlFunctions;