import { forwardRef, useCallback, useEffect, useState } from 'react';
import { SnackbarContent, CustomContentProps, useSnackbar } from 'notistack';

import MUI from '@appui/mui';
import CloseIcon from '@muii/Close';

import combineClasses from '@utils/string/combineClasses';

type Props = CustomContentProps & ControlMe.Notification & {
    onNotificationClose?: (v?: boolean) => void;
};

const Base = forwardRef<HTMLDivElement, Props>((props, ref) => {
    const { closeSnackbar } = useSnackbar();
    const [closed, setClosed] = useState<boolean>(false);

    const close = useCallback((v?: boolean) => {
        if (closed) return;
        setClosed(true);
        
        closeSnackbar(props.id);
        props.onNotificationClose?.(v);
    }, [closeSnackbar, props.onNotificationClose, props.id, closed]);

    useEffect(() => {
        if (!props.timeout) return;
        const t = setTimeout(() => {
            close();
        }, props.timeout);

        return () => clearTimeout(t);
    }, [close, props.timeout]);

    return <SnackbarContent ref={ref} className="notification">
        {(props.title || !props.noClose) && <div className="top">
            {props.title && <p className="title">{props.title}</p>}

            {!props.noClose && <MUI.IconButton
                className="close-button"
                color="error"
                onClick={() => close(props.yesNo ? false : undefined)}
            >
                <CloseIcon />
            </MUI.IconButton>}
        </div>}

        <div className={combineClasses('content', (props.imageWidth ?? 0) >= 128 && 'large-image')}>
            {props.imageSrc && <img
                src={props.imageSrc}
                width={props.imageWidth}
                height={props.imageHeight}
                style={{
                    borderRadius: props.roundImage ? '1000px' : '0'
                }}
            />}
            {props.message && <p>{props.message}</p>}
        </div>

        {props.yesNo && <div className="bottom">
            <MUI.Button
                variant="contained"
                color="info"
                onClick={() => close(false)}
            >YES</MUI.Button>

            <MUI.Button
                variant="contained"
                color="error"
                onClick={() => close(true)}
            >NO</MUI.Button>
        </div>}
    </SnackbarContent>
});

export default Base;