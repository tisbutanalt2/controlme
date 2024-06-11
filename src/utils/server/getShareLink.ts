import authStore from '@utils/store/auth'

export default function getShareLink(sid: string): Auth.ShareLink|string {
    const link = authStore.get(`shareLinks.${sid}`) as Auth.ShareLink|undefined;
    if (!link) return 'Sharelink not found';

    const expired = link.expiresAt
        ? new Date(link.expiresAt).valueOf() < Date.now()
        : false;

    if (expired) {
        return 'This link has expired';
    }

    const currentUses = link.currentUses ?? 0;
    const maxUses = link.maxUses ?? 0;

    if (
        maxUses !== 0 &&
        currentUses >= maxUses
    ) return 'This link has already been used the max amount of times';

    return link;
}