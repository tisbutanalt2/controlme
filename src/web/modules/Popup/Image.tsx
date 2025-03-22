import { useCallback, useState } from 'react';

const ImagePopup: FC<import('.').PopupProps & { type: import('enum').PopupType.Image }> = props => {
    const [pos, setPos] = useState<{ x: number; y: number }|undefined>();

    const onLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const rect = e.currentTarget.getBoundingClientRect();

        const maxX = window.screen.availWidth - rect.width;
        const maxY = window.screen.availHeight - rect.height;

        setPos({
            x: Math.round(Math.random() * maxX),
            y: Math.round(Math.random() * maxY)
        });
    }, []);

    return <img
        style={{
            position: 'fixed',
            opacity: pos ? 1 : 0,
            top: pos?.y,
            left: pos?.x,
            width: 'auto',
            maxHeight: '90vh'
        }}
        onLoad={onLoad}
        src={props.fullPath}
        onClick={(props.closable && pos) ? props.onClose : undefined}
    />
}

export default ImagePopup;