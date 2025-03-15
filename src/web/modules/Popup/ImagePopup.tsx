import PopupBase, { usePopupContext, PopupPropsBase } from './Base';

export interface ImagePopupProps extends PopupPropsBase {
    src: string;
}

const Content: FC<ImagePopupProps> = props => {
    const { onClick } = usePopupContext();
    return <img className="image-popup" onClick={onClick} onError={onClick} data-hover src={`file://${props.src}`} width="auto" height="auto" />
}

const ImagePopup: FC<ImagePopupProps> = props => {
    return <PopupBase {...props}>
        <Content {...props} />
    </PopupBase>
}

export default ImagePopup;