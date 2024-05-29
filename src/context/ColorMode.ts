import { createContext, useContext } from 'react';

const ColorModeContext = createContext<State<ColorMode>>(['dark', () => {}]);

export const useColorMode = () => useContext(ColorModeContext)[0];
export const useColorModeState = () => useContext(ColorModeContext);

export default ColorModeContext;