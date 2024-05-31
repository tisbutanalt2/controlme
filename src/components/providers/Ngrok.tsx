import { useState, useEffect } from 'react';
import NgrokContext from '@context/Ngrok';

/** Provides the Ngrok URL */
const NgrokProvider: FC = ({ children }) => {
    const [ngrokURL, setNgrokURL] = useState<string|null>(null);
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        if (mounted) return;
        setMounted(true);

        window.ipcMain.on('ngrokURL', (url: string) => setNgrokURL(url || null));
        window.ipcMain.ngrokUrl().then((url?: string) => {
            setNgrokURL(url || null);
        });
    }, [mounted]);

    return <NgrokContext.Provider value={[ngrokURL, setNgrokURL]}>
        {children}
    </NgrokContext.Provider>
}

export default NgrokProvider;