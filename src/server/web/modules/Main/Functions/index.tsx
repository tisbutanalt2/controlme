import { useAccessSetup } from '@context/AccessSetup'
import { usePromptCaller } from '@context/Prompt';

import controlFunctions from '@utils/controlFunctions';
import { PromptBaseProps } from '@components/Prompt';
import { useSocket } from '@context/Socket';

import Button from '@muim/Button';

export interface FunctionFieldProps {
    name: string & keyof ControlMe.Functions;
    onRun?(result?: any): void;
    onError?(result?: any): void;
    onClick?(): void;
    customHandler?(): void;
    parseArg?(form: RSAny): any[]|void;
    button?: JSX.Element;
}

export const FunctionDef: FC<FunctionFieldProps & PromptBaseProps> = ({ name, button, onRun, customHandler, onClick, onError, parseArg, children, ...props }) => {
    const accessSetup = useAccessSetup();
    const promptCaller = usePromptCaller();
    
    const socket = useSocket();

    const definition = controlFunctions[name];
    if (!accessSetup?.functions?.[name] || !definition || !socket) return null;

    return <div className="function-def">
        <div className="function-description">{children || name}</div>
        {button || <Button sx={{ ml: 'auto', width: 'fit-content', minWidth: '100px', padding: '8px 16px' }} variant="outlined" color="success" onClick={onClick ?? (() => {
            promptCaller({
                title: props.title ?? definition.title,
                message: props.message ?? `Description: ${definition.description}`,
                formId: props.formId ?? `function-${name}`,
                actions: props.actions ?? [
                    {
                        name: 'cancel',
                        label: 'Cancel'
                    },

                    {
                        name: 'confirm',
                        label: 'Send',
                        requiresValid: true
                    }
                ],
                ...props
            }).then(res => {
                if (res?.action === 'confirm') {
                    if (customHandler) return customHandler();
                    
                    const args = parseArg? parseArg(res.form): [res.form];
                    socket.emit('function', name, [...(args || [])], (err, ...res) => {
                        if (err) {
                            console.error(`Function error: ${name}(): ${err}`);
                            onError?.(err);
                        }

                        else onRun?.(...res);
                    })
                }
            })
        })}>Run</Button>}
    </div>
}

const Functions: FC = ({ children }) => {
    return <div className="function-callers">
        {children}
    </div>
}

export default Functions;