import { useEffect, useState } from 'react';
import combineClasses from '@utils/string/combineClasses';

import UI from '@components/ui';

const WritingPrompt: FC<import('.').PopupProps & { type: import('enum').PopupType.Writing }> = props => {
    const [input, setInput] = useState<string>('');

    useEffect(() => {
        if (props.isSub) return;
        if (input === props.prompt) {
            props.onClose();
        }
    }, [props.isSub, props.prompt, input, props.onClose]);

    return <div className={combineClasses(
        'writing-prompt',
        props.blackScreen && 'black-screen',
        props.isSub && 'sub'
    )}>
        {props.isSub ? (props.message ? <h2 className="message">{props.message}</h2> : null) : <div className="content">
            {props.message && <h2 className="message">{props.message}</h2>}

            <UI.MUI.HelperText sx={{ whiteSpace: 'pre-line' }}>{props.prompt}</UI.MUI.HelperText>

            <UI.MUI.TextField
                value={input}
                className="input"
                multiline
                sx={{ width: '400px' }}
                size="medium"
                onChange={e => {
                    const newInput = e.target.value;
                    setInput(prev => {
                        const diff = newInput.length - prev.length;
                        if ((diff < 0) || diff > 1) return prev;

                        if (props.prompt.substring(0, newInput.length) !== newInput) return prev;
                        return newInput.substring(0, newInput.length - diff + 1);
                    });
                }}
            />
        </div>}
    </div>
}

export default WritingPrompt;