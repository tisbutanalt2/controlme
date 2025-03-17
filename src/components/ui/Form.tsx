import { useCallback, useMemo } from 'react';
import randomUUID from 'v4-uuid';

import FormContext from '@context/Form';

interface Props {
    id?: string;
    state: State<RSAny>;
    errors?: Record<string, string>;
}

const Form: FCC<Props> = props => {
    const [,setForm] = props.state;

    const onFieldChange = useCallback((k: string, v: any) => {
        setForm(prev => ({
            ...prev,
            [k]: v
        }));
    }, [setForm]);

    const id = useMemo(() =>
        props.id ?? `form-${randomUUID()}`,
        [props.id]
    );

    return <FormContext.Provider value={{
        id,
        state: props.state,
        errors: props.errors,
        onFieldChange
    }}>
        <div className="form" id={id}>
            {props.children}
        </div>
    </FormContext.Provider>
}

export default Form;