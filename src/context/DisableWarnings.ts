import { createContext, useContext } from 'react';

const DisableWarningsContext = createContext<State<boolean>>([false, () => {}]);

export const useDisableWarnings = () => useContext(DisableWarningsContext)[0];
export const useDisableWarningsState = () => useContext(DisableWarningsContext);

export default DisableWarningsContext;