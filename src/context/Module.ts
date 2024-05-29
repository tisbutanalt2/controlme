// SERVER COMPONENT
import { createContext, useContext } from 'react';

const ModuleContext = createContext<State<string>>(
    ['loading', () => {}]
);

export const useModule = () => useContext(ModuleContext)[0];
export const useModuleState = () => useContext(ModuleContext);

export default ModuleContext;