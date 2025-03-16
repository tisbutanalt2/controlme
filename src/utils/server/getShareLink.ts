import authStore from '@stores/auth';

export default function getShareLink(
    sid: string,
    increment: boolean = false,
    deleteIfInvalid: boolean = true
): Auth.ShareLink|string {
    const key = `shareLinks.${sid}`;

    const link = authStore.get(key) as Auth.ShareLink;
    if (!link) return 'Sharelink not found';

    if (
        link.expiration &&
        Math.floor(Date.now() / 1000) >= link.expiration
    ) {
        deleteIfInvalid && authStore.delete(key as keyof Auth.Store);
        return 'Sharelink has expired';
    }

    const currentUses = (link.uses ?? 0) + 1;
    const maxUses = link.maxUses ?? Infinity;

    if (currentUses > maxUses) {
        deleteIfInvalid && authStore.delete(key as keyof Auth.Store);
        return 'Sharelink has been used the max amount of times';
    }

    if (increment) {
        link.uses = currentUses;

        // Delete the link if this was the final use
        if (currentUses === maxUses) authStore.delete(key as keyof Auth.Store);
        else authStore.set(key as keyof Auth.Store, link);
    }

    return link;
}