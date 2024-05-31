import { useCallback, useMemo } from 'react';
import { randomUUID } from 'crypto';

import { useForm } from '@context/Form';

import TextField from './Text';

const Field: FC<UI.FieldProps> = props => {
    const { state: [form], onFieldChange } = useForm();
    
    // Randomize ID if not defined
    const id = useMemo(() => props.id ?? randomUUID(), [props.id]);
    const helperId = props.description && `${id}-${props.description}`;

    const onChange = useCallback((v: any) => {
        props.onChange
            ?props.onChange(v)
            :onFieldChange(props.name, v);
    }, [props.name, props.onChange]);

    switch(props.type) {
        case 'text':
            return <TextField id={id} helperId={helperId} {...props} />
    }
}