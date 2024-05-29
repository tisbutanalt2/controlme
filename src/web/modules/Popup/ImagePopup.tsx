import PopupBase, { usePopupContext, PopupPropsBase } from './Base';

export interface ImagePopupProps extends PopupPropsBase {
    src: string;
}

const ImagePopup: FC<ImagePopupProps> = props => {
    const { onClick } = usePopupContext();

    return <PopupBase {...props}>
        {props.src}
        <img onClick={onClick} data-hover src={`file://${props.src}`} width="auto" height="auto" />
    </PopupBase>
}

export default ImagePopup;