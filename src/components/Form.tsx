import { useCallback } from 'react';
import FormContext from '@context/Form';

import Stack from '@muim/Stack';
import { SxProps } from '@muim/styles';

interface Props {
    id: string;
    state: State<RSAny>;
    errors?: Record<string, string|null|false>;
    sx?: SxProps;
}

/** Provides the FormContext to child fields for easier state management */
const Form: FC<Props> = props => {
    const [,setForm] = props.state;
    
    const onFieldChange = useCallback((k: string, v: any) => {
        setForm(prev => {
            const newForm = {...prev};
            newForm[k] = v;
            return newForm;
        });
    }, [setForm]);

    return <FormContext.Provider value={{
        id: props.id,
        state: props.state,
        errors: props.errors,
        onFieldChange
    }}>
        <div id={props.id}>
            <Stack sx={props.sx}>
                {props.children}
            </Stack>
        </div>
    </FormContext.Provider>
}

export default Form;