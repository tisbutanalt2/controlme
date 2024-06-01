import { useCallback, useMemo } from 'react';
import randomUUID from 'v4-uuid';

import { useForm } from '@context/Form';

import TextField from './Text';
import NumberField from './Number';
import Checkbox from './Checkbox';
import Switch from './Switch';
import Select from './Select';

const Field: FC<UI.FieldProps> = props => {
    const { errors, onFieldChange, id: formId } = useForm();
    
    // Randomize ID if other fallbacks fail
    const id = useMemo(() =>
        props.id ?? (formId
            ?`${formId}-${props.name}`
            :randomUUID()
        ),
        [formId, props.id]
    );

    const onChange = useCallback((v: any) => {
        props.onChange
        ?props.onChange(v)
        :onFieldChange(props.name, v);
    }, [props.name, props.onChange]);

    const helperId = props.description && `${id}-helper`;
    const fieldError = errors?.[props.name];

    const fieldProps: UI.FieldBaseProps = {
        id,
        helperId,
        onChange,
        error: fieldError,
        ...props
    };

    switch(props.type) {
        case 'text':
            return <TextField {...fieldProps} />
        case 'number':
            return <NumberField {...fieldProps} />
        case 'checkbox':
            return <Checkbox {...fieldProps} />
        case 'switch':
            return <Switch {...fieldProps} />
        case 'select':
            return <Select {...fieldProps} />
        case 'range':
            console.warn('Sliders aren\'t implemented yet');
            return null // TODO
        default:
            console.warn(`Field type ${(props as { type: string }).type} does not exist`);
            return null;
    }
}

export default Field;