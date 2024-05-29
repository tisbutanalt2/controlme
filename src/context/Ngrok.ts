import { createContext, useContext } from 'react';

const NgrokContext = createContext<State<string|null>>([null, () => {}]);
export const useNgrokURL = () => useContext(NgrokContext)[0];
export const useNgrokState = () => useContext(NgrokContext);

export default NgrokContext;