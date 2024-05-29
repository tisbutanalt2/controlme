import { useState, useEffect, createContext, useContext, Fragment } from 'react';
import { PopupPropsBase } from './Base';

import ImagePopup, { ImagePopupProps } from './ImagePopup';

type PopupProps = PopupPropsBase & (
    { type: 'image' } & ImagePopupProps|
    { type: 'writing' } & {});

export const PopupsContext = createContext<State<PopupProps[]>>([[], () => {}]);
export const usePopupsState = () => useContext(PopupsContext);

const Popup = () => {
    const [mounted, setMounted] = useState<boolean>(false);
    const [popups, setPopups] = useState<PopupProps[]>([]);

    // Logic for deciding whether or not the mouse should be picked up by the popup module
    useEffect(() => {
        if (mounted) return;
        setMounted(true);

        let focused = false;
        window.addEventListener('mousemove', e => {
            const target = document.elementFromPoint(e.clientX, e.clientY);
            const element = (
                (target !== document.body) &&
                (target?.id !== 'root') &&
                target?.getAttribute('data-hover') !== null
            )? target: null;

            if (element) {
                !focused && window.popupIpc.focus();
                focused = true;
            }

            else {
                focused && window.popupIpc.blur();
                focused = false;
            }
        });

        window.popupIpc.on('popup', (props: PopupProps) => {
            console.log(props);
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