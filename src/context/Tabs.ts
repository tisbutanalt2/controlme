import { createContext, useContext } from 'react';

const TabsContext = createContext<State<number|null>>([null, () => {}]);

export const useCurrentTab = () => useContext(TabsContext)[0];
export const useTabsState = () => useContext(TabsContext);

export default TabsContext;