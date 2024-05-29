import { createContext, useContext } from 'react';

const IgnoreDangerousContext = createContext<State<boolean>>([false, () => {}]);

export const useIgnoreDangerous = () => useContext(IgnoreDangerousContext)[0];
export const useIgnoreDangerousState = () => useContext(IgnoreDangerousContext);

export default IgnoreDangerousContext;