import { ipcRenderer } from 'electron';

const shareFunctions = {
    getShareLinks: () => ipcRenderer.invoke('share.get') as Promise<Auth.ShareLink[]>,

    generateShareLink: (options: Omit<Auth.ShareLink, 'id'>) =>
        ipcRenderer.invoke('share.generate', options) as Promise<Auth.ShareLink>,

    deleteShareLink: (id: string) => ipcRenderer.send('share.delete', id),

    onShareLinkAdded: (cb: (link: Auth.ShareLink) => void) => {
        const listener = (e, link: Auth.ShareLink) => {
            cb(link);
        }

        ipcRenderer.on('share.added', listener);
        return () => {
            ipcRenderer.off('share.added', listener);
        }
    },

    onShareLinkDeleted: (cb: (id: string) => void) => {
        const listener = (e, id: string) => {
            cb(id);
        }

        ipcRenderer.on('share.deleted', listener);
        return () => {
            ipcRenderer.off('share.deleted', listener);
        }
    }
};

export default shareFunctions;