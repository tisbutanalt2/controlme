import { createContext, useContext, useEffect, useState } from 'react';
import { defaultSettings } from 'const';

import Menu from './Menu';
import MenuTab from './MenuTab';

import GeneralSettings from './General';
import AppearanceSettings from './Appearance';
import FunctionSettings from './Functions';
import ChatSettings from './Chat';
import WebcamSettings from './Webcam';
import FileSettings from './Files';
import SecuritySettings from './Security';
import ServerSettings from './Server';
import NgrokSettings from './Ngrok';
import DiscordSettings from './Discord';
import About from './About';

export const SettingsContext = createContext<State<ControlMe.Settings>>([defaultSettings, () => {}]);
export const useSettingsContext = () => useContext(SettingsContext);

export const MenuContext = createContext<State<number>>([0, () => {}]);
export const useMenuContext = () => useContext(MenuContext);

const Settings = () => {
    const [index, setIndex] = useState<number>(0);

    const [settings, setSettings] = useState<ControlMe.Settings>(defaultSettings);
    const [,setLastSettings] = useState<ControlMe.Settings>(defaultSettings);

    const [fetched, setFetched] = useState<boolean>(false);

    useEffect(() => {
        window.ipcMain.getConfig().then(cfg => {
            setSettings(cfg);
            setLastSettings(cfg);
            setFetched(true);
        });
    }, []);

    // Check object refs and dynamically update
    useEffect(() => {
        if (!fetched) return;

        setLastSettings(prev => {
            for (const k in settings) {
                if (settings[k] !== prev[k]) {
                    window.ipcMain.setConfigValue(k, settings[k]);
                }
            }

            return settings;
        })
    }, [fetched, settings]);

    if (!fetched) return null;

    return <div className="settings">
        <MenuContext.Provider value={[index, setIndex]}>
            <Menu />
            <SettingsContext.Provider value={[settings, setSettings]}>
                <div className="settings-content-wrapper">
                    <div className="settings-content">
                        <MenuTab name="general" title="General Settings">
                            <GeneralSettings />
                        </MenuTab>

                        <MenuTab name="appearance" title="Appearance Settings">
                            <AppearanceSettings />
                        </MenuTab>

                        <MenuTab name="functions" title="Function Settings">
                            <FunctionSettings />
                        </MenuTab>

                        <MenuTab name="chat" title="Chat Settings">
                            <ChatSettings />
                        </MenuTab>

                        <MenuTab name="webcam" title="Webcam Settings">
                            <WebcamSettings />
                        </MenuTab>

                        <MenuTab name="files" title="File Settings">
                            <FileSettings />
                        </MenuTab>

                        <MenuTab name="security" title="Security Settings">
                            <SecuritySettings />
                        </MenuTab>

                        <MenuTab name="server" title="Server Settings">
                            <ServerSettings />
                        </MenuTab>

                        <MenuTab name="ngrok" title="Ngrok Settings">
                            <NgrokSettings />
                        </MenuTab>

                        <MenuTab name="discord" title="Discord Settings">
                            <DiscordSettings />
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