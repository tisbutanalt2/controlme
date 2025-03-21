import { useCallback, useEffect, useState } from 'react';
import { PopupType } from 'enum';

import ColorModeProvider from '@providers/ColorMode';

import WritingPrompt from './WritingPrompt';

const popupType = (t) => t === PopupType.Image
        ? 'image'
    : t === PopupType.Video
        ? 'video'
    : t === PopupType.Audio
        ? 'audio'
    : 'writing';

export type PopupProps = ControlMe.Popup & {
    onClose(): void;
}

const Sub = () => {
    const [mounted, setMounted] = useState<boolean>(false);
    const [popups, setPopups] = useState<Array<ControlMe.Popup>>([]);

    const onClose = useCallback((id: string, popupType: string) => {
        setPopups(prev => prev.filter(p => p.id !== id));
        window.ipcPopup.popupClosed(id, popupType);
    }, []);

    useEffect(() => {
        if (mounted) return;
        setMounted(true);

        window.ipcPopup.onPopup((popup) => {
            if (popup.timeout && popup.timeout > 0) setTimeout(() => {
                setPopups(prev => prev.filter(p => p.id !== popup.id));
                window.ipcPopup.popupClosed(popup.id, popupType(popup.type));
            }, popup.timeout * 1000);

            setPopups(prev => [...prev, popup]);
        });

        window.ipcPopup.onPopupClosed(id => {
            setPopups(prev => prev.filter(p => p.id !== id));
        });
    }, [mounted]);
    
    return popups.map((popup, i) => {
        switch(popup.type) {
            case PopupType.Writing:
                return <WritingPrompt key={i} {...popup} onClose={() => onClose(popup.id, 'writing')} />
            default:
                return null;
        }
    });
}

const Popup = () => {
    return <ColorModeProvider noSet>
        <Sub />
    </ColorModeProvider>
}

export default Popup;