import { Router } from 'express';
import getShareLink from '@utils/server/getShareLink';

import { ShareLinkType } from 'enum';

const shareMiddleware = Router();

shareMiddleware.use('/', (req, res, next) => {
    const sid = req.query.sid as string|undefined;
    if (!sid) return next();

    const shareLink = getShareLink(sid);
    if (typeof shareLink === 'string')
        return res.status(400).send(shareLink);

    if (shareLink.type === ShareLinkType.Discord)
        return res.redirect(`/auth/discord?sid=${sid}`);

    next();
});

export default shareMiddleware;