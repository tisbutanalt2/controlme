import configStore from '@utils/store/config';
import decodeUserToken from './decodeUserToken';
import authStore from '@utils/store/auth';

export default function getFunctionAccess(overridesOrToken?: Auth.AccessOverrides|string, reject: boolean = false): ControlMe.Settings['functions'] {
    const base = { ...configStore.get('functions') };

    if (typeof overridesOrToken === 'string') {
        const user = decodeUserToken(overridesOrToken);
        if (user) return getFunctionAccess(user.accessOverrides);

        const shareLink = authStore.get(`shareLinks.${overridesOrToken}`) as Auth.ShareLink;
        if (shareLink) return getFunctionAccess(shareLink.accessOverrides);

        if (reject) {
            let rejected = <ControlMe.Settings['functions']>{};
            for (const k in base) {
                rejected[k] = false;
            }

            return rejected;
        }
    }

    if (typeof overridesOrToken === 'object') {
        for (const k in overridesOrToken) {
            base[k] = overridesOrToken[k];
        }
    }

    return base as ControlMe.Settings['functions'];
}