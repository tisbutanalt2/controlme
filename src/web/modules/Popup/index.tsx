import { useState, useEffect, createContext, useContext, Fragment } from 'react';
import { PopupPropsBase } from './Base';

import ImagePopup, { ImagePopupProps } from './ImagePopup';
import useTransparentPassthrough from '@hooks/useTransparentPassthrough';

type PopupProps = PopupPropsBase & (
    { type: 'image' } & ImagePopupProps|
    { type: 'writing' } & {});

export const PopupsContext = createContext<State<PopupProps[]>>([[], () => {}]);
export const usePopupsState = () => useContext(PopupsContext);

const Popup = () => {
    const [mounted, setMounted] = useState<boolean>(false);
    const [popups, setPopups] = useState<PopupProps[]>([]);

    useTransparentPassthrough(window.ipcPopup.focus, window.ipcPopup.blur);

    useEffect(() => {
        if (mounted) return;
        setMounted(true);

        window.ipcPopup.on('popup', (props: PopupProps) => {
            setPopups(prev => [...prev, props]);
        });
    }, [mounted]);

    return <PopupsContext.Provider value={[popups, setPopups]}>
        {popups.map((popup, i) => <Fragment key={i}>
            {popup.type === 'image' && <ImagePopup {...popup} />}
        </Fragment>)}
    </PopupsContext.Provider>
}

export default Popup;