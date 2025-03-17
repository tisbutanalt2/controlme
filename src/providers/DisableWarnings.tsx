import { useState, useEffect } from 'react';
import DisableWarningsContext from '@context/DisableWarnings';

/** Provides the "Ignore warnings" option */
const DisableWarningsProvider: FC = ({ children }) => {
    const [disableWarnings, setDisableWarnings] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const [fetched, setFetched] = useState<boolean>(false);

    useEffect(() => {
        if (!mounted && !fetched) {
            setMounted(true);

            window.ipcMain.getConfigValue('general.disableWarnings').then((ignore: boolean) => {
                setDisableWarnings(ignore);
                setFetched(true);
            });
        }

        fetched && window.ipcMain.setConfigValue('general.disableWarnings', disableWarnings);
    }, [disableWarnings, mounted, fetched]);

    return <DisableWarningsContext.Provider value={[disableWarnings, setDisableWarnings]}>
        {children}
    </DisableWarningsContext.Provider>
}

export default DisableWarningsProvider;