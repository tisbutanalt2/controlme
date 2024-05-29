// SERVER COMPONENT
import { createContext, useContext } from 'react';

/** @deprecated use AccessSetup instead */
const ShareLinkContext = createContext<State<Auth.ReducedShareLink|null>>(
    [null, () => {}]
);

export const useShareLink = () => useContext(ShareLinkContext)[0];
export const useShareLinkState = () => useContext(ShareLinkContext);

export default ShareLinkContext;