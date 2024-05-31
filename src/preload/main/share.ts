import { ipcRenderer } from 'electron';

const shareFunctions = {
    getShareLinks: () => ipcRenderer.invoke('shareLink.getAll') as Promise<Auth.ShareLink[]>,

    generateShareLink: (options: Omit<Auth.ShareLink, 'id'>) =>
        ipcRenderer.invoke('shareLink.generate', options) as Promise<string>,

    modifyShareLink: (id: string, options: Partial<Auth.ShareLink>) =>
        ipcRenderer.invoke('shareLink.modify', id, options),

    deleteShareLink: (id: string) => ipcRenderer.invoke('shareLink.delete', id)
};

export default shareFunctions;