import { useState, useEffect, createContext, useRef, useContext, useCallback } from 'react';
import { usePopupsState } from '.';
import clamp from '@utils/number/clamp';

export interface PopupPropsBase {
    id: string;
    fullscreen?: boolean;
    ignoreClick?: boolean;
    timeout?: number;
    x?: number;
    y?: number;
    opacity?: number;
}

interface CTX {
    onClick?(): void;
}

export const PopupContext = createContext<CTX>({});
export const usePopupContext = () => useContext(PopupContext);

const PopupBase: FC<PopupPropsBase> = props => {
    const divRef = useRef<HTMLDivElement|null>(null);

    const [, setPopups] = usePopupsState();
    const [loaded, setLoaded] = useState<boolean>(false);

    const onClick = useCallback(() => {
        if (props.ignoreClick || !divRef.current) return;

        // Additional hiding function
        divRef.current.setAttribute('hidden', '');

        setPopups(prev => [...prev.filter(popup => (popup.id !== props.id))]);
    }, [props.ignoreClick, divRef]);

    useEffect(() => {
        if (!loaded || !divRef.current) return;
        const div = divRef.current;

        const rect = div.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        if (!props.x)
            div.style.left = Math.floor(Math.random() * Math.abs((window.screen.width - clamp(width, 0, window.screen.width)))) + 'px';
        if (!props.y)
            div.style.top = Math.floor(Math.random() * Math.abs((window.screen.height - clamp(height, 0, window.screen.height)))) + 'px';

        if (width >= window.screen.height) div.style.left = '0px';
        if (height >= window.screen.height) div.style.top = '0px';

        // TEMP
        const clear = setTimeout(onClick, ((Math.random() * 10) + 20) * 1000);
        () => clearTimeout(clear);
    }, [divRef, loaded, onClick]);

    return <div
        ref={div => {
            divRef.current = div;
            setTimeout(() => setLoaded(true), 500);
        }}
        id={props.id}
        data-hover
        style={{
            position: 'fixed',
            top: props.fullscreen? 0: props.x,
            left: props.fullscreen? 0: props.y,
            width: props.fullscreen? '100%': 'fit-content',
            height: props.fullscreen? '100%': 'fit-content',
            backgroundColor: props.fullscreen? '#000': 'transparent',
            opacity: (loaded && !props.fullscreen)? (props.opacity ?? 1): 0
            //display: 'flex',
            //justifyContent: 'center',
            //alignItems: 'center'
        }}
        onClick={onClick}
    >
        <PopupContext.Provider value={{ onClick }}>
            {props.children}
        </PopupContext.Provider>
    </div>
}

export default PopupBase;