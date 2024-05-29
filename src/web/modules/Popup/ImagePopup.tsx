import PopupBase, { usePopupContext, PopupPropsBase } from './Base';

export interface ImagePopupProps extends PopupPropsBase {
    src: string;
}

const ImagePopup: FC<ImagePopupProps> = props => {
    const { onClick } = usePopupContext();

    return <PopupBase {...props}>
        <img className="image-popup" onClick={onClick} onError={onClick} data-hover src={`file://${props.src}`} width="auto" height="auto" />
    </PopupBase>
}

export default ImagePopup;