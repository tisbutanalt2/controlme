import { useEffect } from 'react';
import PopupBase, { usePopupContext, PopupPropsBase } from './Base';

export interface ImagePopupProps extends PopupPropsBase {
    src: string;
}

const Content: FC<ImagePopupProps> = props => {
    const { onClick } = usePopupContext();

    useEffect(() => {
        const t = setTimeout(onClick, ((Math.random() * 10) + 20) * 1000);
        return () => clearTimeout(t);
    }, [onClick]);

    return <img className="image-popup" onClick={onClick} onError={onClick} data-hover src={`file://${props.src}`} width="auto" height="auto" />
}

const ImagePopup: FC<ImagePopupProps> = props => {
    return <PopupBase {...props}>
        <Content {...props} />
    </PopupBase>
}

export default ImagePopup;