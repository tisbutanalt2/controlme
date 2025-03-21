import { useEffect, useState, useMemo, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@muim/styles';

import ColorModeContext from '@context/ColorMode';

const ColorModeProvider: FC<{ noIpc?: boolean }> = ({ children, noIpc }) => {
    const [colorMode, setColorMode] = useState<ColorMode>('dark');

    const [mounted, setMounted] = useState<boolean>(false);
    const [valueFetched, setValueFetched] = useState<boolean>(false);

    const theme = useMemo(() => createTheme({
        palette: {
            mode: colorMode
        }
    }), [colorMode]);

    const getStoredMode = useCallback(() => {
        if (noIpc) return Promise.resolve(localStorage.getItem('theme') !== 'light');
        return window.ipcMain.getConfigValue('appearance.darkTheme');
    }, [noIpc]);

    const setStoredMode = useCallback(() => {
        if (noIpc) return localStorage.setItem('theme', colorMode);
        window.ipcMain.setConfigValue('appearance.darkTheme', colorMode === 'dark');
    }, [noIpc, colorMode]);

    useEffect(() => {
        if (!mounted && !valueFetched) {
            setMounted(true);

            getStoredMode().then(darkTheme => {
                setColorMode(darkTheme? 'dark': 'light');
                setValueFetched(true);
            });
        }

        const opposite: ColorMode = (colorMode === 'dark')? 'light':'dark';

        document.body.classList.remove(opposite);
        document.body.classList.add(colorMode);

        valueFetched && setStoredMode();
    }, [colorMode, mounted, valueFetched, getStoredMode, setStoredMode]);

    return <ColorModeContext.Provider value={[colorMode, setColorMode]}>
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    </ColorModeContext.Provider>
}

export default ColorModeProvider;