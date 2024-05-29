// SERVER COMPONENT
import { createContext, useContext } from 'react';

const WebErrorContext = createContext<State<string|null>>(
    [null, () => {}]
);

export const useWebError = () => useContext(WebErrorContext)[0];
export const useWebErrorState = () => useContext(WebErrorContext);

export default WebErrorContext;