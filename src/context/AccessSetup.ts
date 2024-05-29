// SERVER COMPONENT
import { createContext, useContext } from 'react';

const AccessSetupContext = createContext<State<ControlMe.Web.AccessSetup|null>>(
    [null, () => {}]
);

export const useAccessSetup = () => useContext(AccessSetupContext)[0];
export const useAccessSetupState = () => useContext(AccessSetupContext);

export default AccessSetupContext;