import { useCallback, useState } from 'react';

import FormContext from '@context/Form';
import Field from '@appui/Field';

import Button, { ButtonProps } from '@muim/Button';

import Dialog from '@muim/Dialog';
import DialogActions from '@muim/DialogActions';
import DialogContent from '@muim/DialogContent';
import DialogContentText from '@muim/DialogContentText';
import DialogTitle from '@muim/DialogTitle';

export type PromptBaseProps = {
    title?: string;

    message?: string;
    bottomMessage?: string;

    canClose?: boolean;

    actions?: {
        name: string;
        label: string;
        closesDialog?: boolean;
        variant?: ButtonProps['variant'];
        requiresValid?: boolean;
    }[];

    formId?: string;
    fields?: UI.FieldProps[];
    fieldErrors?: Record<string, string>;

    content?: JSX.Element;
    validate?(form: RSAny): RSAny|true|undefined|void;
};

export type PromptProps = PromptBaseProps & {
    open: boolean;
    onClose(): void;
    onAction(name: string, form?: RSAny): void;
}

/** Displays a MUI prompt */
const Prompt: FC<PromptProps> = props => {
    const [form, setForm] = useState<RSAny>({});
    const [errors, setErrors] = useState<RSAny>({});

    const onFieldChange = useCallback((k: string, v: string) => {
        setForm(prev => {
            const next = {...prev};
            next[k] = v;

            if (props.validate) {
                const result = props.validate(next);
                setErrors(typeof result === 'object'? result: {});
            }

            return next;
        });
    }, [props.validate]);

    return <Dialog
        open={props.open}
        onClose={(props.canClose !== false)? props.onClose: undefined}
    >
        {props.title && <DialogTitle>{props.title}</DialogTitle>}

        <DialogContent>
            {props.message && <DialogContentText sx={props.formId? { mb: '12px' }: undefined}>{props.message}</DialogContentText>}
            {props.formId? <FormContext.Provider value={{
                id: props.formId,
                state: [form, setForm],
                errors: props.fieldErrors || errors as Record<string, string>,
                onFieldChange
            }}>
                {props.fields?.map(field => <Field key={field.name} {...field} />)}
            </FormContext.Provider>:null}
            {props.children}
            {props.content}
            {props.bottomMessage && <DialogContentText sx={{ mt: '24px' }}>{props.bottomMessage}</DialogContentText>}
        </DialogContent>

        {props.actions && <DialogActions>
            {props.actions.map((action, i) => <Button
                key={i}
                onClick={() => {
                    if (props.validate && action.requiresValid) {
                        const validateResult = props.validate(form);
                        
                        if (typeof validateResult === 'object' && Object.keys(validateResult).length !== 0) {
                            setErrors(validateResult);
                            return;
                        }
                    }

                    props.onAction(action.name, Object.keys(form).length? form: undefined);
                    ([true, undefined].includes(action.closesDialog)) && props.onClose?.();
                }}
                variant={action.variant}
            >{action.label}</Button>)}
        </DialogActions>}
    </Dialog>
}

export default Prompt;