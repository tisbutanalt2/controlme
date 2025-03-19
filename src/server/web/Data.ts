import { createContext, useContext } from 'react';

const DataContext = createContext<State<ControlMe.MinifiedWebData|undefined>>([undefined, () => {}]);

export const useData = () => useContext(DataContext)[0];
export const useDataContext = () => useContext(DataContext);

export default DataContext;