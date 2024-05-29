import { useEffect } from 'react';
import { useForm } from '@context/Form';
import useMounted from '@hooks/useMounted';

import TextField, { TextFieldProps } from './Text';
import NumberField, { NumberFieldProps } from './Number';
import Switch, { SwitchProps } from './Switch';
import Checkbox, { CheckboxProps } from './Checkbox';
import SelectField, { SelectFieldProps } from './Select';

export type FieldProps = Omit<FieldBaseProps, 'id'> & ({
    type: 'number'|'range';
    defaultValue?: number;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
}|({ type: 'text' } & TextFieldProps)|
({ type: 'number' } & NumberFieldProps)|
({ type: 'switch' } & SwitchProps)|
{ type: 'checkbox' } & CheckboxProps|
{ type: 'select' } & SelectFieldProps);

/** Relies on FormContext to set the field value. Alternatively pass the onChange and value props */
const Field: FC<FieldProps> = props => {
    const { id, onFieldChange, state: [form] } = useForm();
    const mounted = useMounted();

    const currentValue = form[props.name];
    const defaultValue = props.defaultValue;

    useEffect(() => {
        if (
            mounted ||
            currentValue !== undefined ||
            defaultValue === undefined
        ) return;

        onFieldChange(props.name, defaultValue);
    }, [mounted, props.name, currentValue, defaultValue, onFieldChange]);

    const fieldId = `${id}-${props.name}`;

    switch(props.type) {
        case 'text':
            return <TextField {...props} id={fieldId} />

        case 'number':
            return <NumberField {...props} id={fieldId} />

        case 'switch':
            return <Switch {...props} id={fieldId} />
        
        case 'checkbox':
            return <Checkbox {...props} id={fieldId} />

        case 'select':
            return <SelectField {...props} id={fieldId} />

        default:
            return null;
    }
}

export default Field;