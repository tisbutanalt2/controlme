import { useEffect, useState, createContext, useContext } from 'react';
import { defaultSettings } from '@utils/constants';

import Menu from './Menu';
import MenuTab from './MenuTab';

import GeneralSettings from './General';
import AppearanceSettings from './Appearance';
import FunctionSettings from './Functions';
import WebcamSettings from './Webcam';
import FileSettings from './Files';
import SecuritySettings from './Security';
import ServerSettings from './Server';
import NgrokSettings from './Ngrok';
import About from './About';

export const SettingsContext = createContext<State<ControlMe.Settings>>([{} as ControlMe.Settings, () => {}])
export const useSettingsContext = () => useContext(SettingsContext);

export const MenuContext = createContext<State<number>>([0, () => {}]);
export const useMenuContext = () => useContext(MenuContext);

const Settings = () => {
    const [index, setIndex] = useState<number>(0);
    
    const [settings, setSettings] = useState<ControlMe.Settings>(defaultSettings);
    const [,setLastSettings] = useState<ControlMe.Settings>(settings);

    const [mounted, setMounted] = useState<boolean>(false);
    const [fetchDone, setFetchDone] = useState<boolean>(false);

    useEffect(() => {
        if (mounted || fetchDone) return;
        setMounted(true);

        window.ipcMain.getConfig().then(cfg => {
            setSettings(cfg);
            setLastSettings(cfg);
            setFetchDone(true);
        });
    }, []);

    // Silly way of checking object refs and dynamically updating
    useEffect(() => {
        if (!fetchDone) return;

        setLastSettings(prev => {
            for (const k in settings) {
                if (settings[k] !== prev[k]) {
                    window.ipcMain.setConfigValue(k, settings[k]);
                }
            }

            return settings;
        });
    }, [fetchDone, settings]);

    if (!fetchDone) return null;

    return <div className="settings-tab">
        <MenuContext.Provider value={[index, setIndex]}>
            <Menu />
            <SettingsContext.Provider value={[settings, setSettings]}>
                <div className="settings-content">
                    <div className="settings-content-container">
                        <MenuTab name="general" title="General Settings">
                            <GeneralSettings />
                        </MenuTab>

                        <MenuTab name="appearance" title="Appearance settings">
                            <AppearanceSettings />
                        </MenuTab>

                        <MenuTab name="functions" title="Function Access">
                            <FunctionSettings />
                        </MenuTab>

                        <MenuTab name="webcam" title="Webcam">
                            <WebcamSettings />
                        </MenuTab>

                        <MenuTab name="files" title="Files">
                            <FileSettings />
                        </MenuTab>

                        <MenuTab name="security" title="Security settings">
                            <SecuritySettings />
                        </MenuTab>

                        <MenuTab name="server" title="Server settings">
                            <ServerSettings />
                        </MenuTab>

                        <MenuTab name="ngrok" title="Ngrok tunneling">
                            <NgrokSettings />
                        </MenuTab>

                        <MenuTab name="about" title="About App">
                            <About />
                        </MenuTab>
                    </div>
                </div>
            </SettingsContext.Provider>
        </MenuContext.Provider>
    </div>
}

export default Settings;