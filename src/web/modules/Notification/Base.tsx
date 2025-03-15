import { useEffect, useRef } from 'react';

import UI from '@components/ui';
import combineClasses from '@utils/string/combineClasses';

type Props = ControlMe.Web.Notification & {
    onClose(result: boolean|null): void;
}

const NotificationComponent: FC<Props> = props => {
    const timeoutRef = useRef(0);

    useEffect(() => {
        if (!props.timeout) return;
        !timeoutRef.current && (timeoutRef.current = setTimeout(() => {
            props.onClose(null);
        }, props.timeout) as unknown as number);

        return () => {
            timeoutRef.current && clearTimeout(timeoutRef.current);
            timeoutRef.current = 0;
        }
    }, [props.timeout, timeoutRef, props.onClose]);

    return <div className="notification" data-hover>
        {(props.title || !props.noClose) && <div className="top" data-hover>
            {props.title && <div className="title" data-hover>
                <h2 data-hover>{props.title}</h2>
            </div>}

            {!props.noClose && <UI.Button variant="contained" color="error" className="close-notif" data-hover onClick={() => props.onClose(null)}>
                &times;
            </UI.Button>}
        </div>}

        <div className={combineClasses('main', props.imageSrc && 'with-image')} data-hover>
            {props.imageSrc && <div className="image" data-hover>
                <img src={props.imageSrc} width="100" height="auto" data-hover />
            </div>}

            <div className="description" data-hover>
                {props.description}
            </div>
        </div>

        {props.yesNo && <div className="actions" data-hover>
            <UI.Button variant="contained" color="success" data-hover onClick={() => props.onClose(true)}>
                Yes
            </UI.Button>

            <UI.Button variant="contained" color="error" data-hover onClick={() => props.onClose(false)}>
                No
            </UI.Button>
        </div>}
    </div>
}

export default NotificationComponent;