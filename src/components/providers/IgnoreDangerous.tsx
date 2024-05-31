import { useState, useEffect } from 'react';
import IgnoreDangerousContext from '@context/IgnoreDangerous';

/** Provides the "Ignore warnings" option */
const IgnoreDangerousProvider: FC = ({ children }) => {
    const [ignoreDangerous, setIgnoreDangerous] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const [valueFetched, setValueFetched] = useState<boolean>(false);

    useEffect(() => {
        if (!mounted && !valueFetched) {
            setMounted(true);

            window.ipcMain.getConfigValue('general.disableWarnings').then((ignore: boolean) => {
                setIgnoreDangerous(ignore);
                setValueFetched(true);
            });
        }

        valueFetched && window.ipcMain.setConfigValue('general.disableWarnings', ignoreDangerous);
    }, [ignoreDangerous, mounted, valueFetched]);

    return <IgnoreDangerousContext.Provider value={[ignoreDangerous, setIgnoreDangerous]}>
        {children}
    </IgnoreDangerousContext.Provider>
}

export default IgnoreDangerousProvider;