import { useForm } from '@context/Form';

import FormControl from '@muim/FormControl';
import Select from '@muim/Select';
import MenuItem from '@muim/MenuItem';
import OutlinedInput from '@muim/OutlinedInput';
import InputLabel from '@muim/InputLabel';
import FormHelperText from '@muim/FormHelperText';

export interface SelectFieldProps {
    defaultValue?: string;
    options: { label: string; value: string }[];

    onChange?(k: string, v: string): void;
}

const SelectField: FC<FieldBaseProps & SelectFieldProps> = props => {
    const { state: [form], errors, onFieldChange } = useForm();    
    const helperId = props.description && `${props.id}-description`;

    const fieldError = errors?.[props.name];
    const helperText = fieldError || props.description;

    const isError = Boolean(fieldError);

    return <div>
        <FormControl disabled={props.disabled} sx={props.sx}>
            {props.label && <InputLabel error={isError} htmlFor={props.id}>
                {props.label}
            </InputLabel>}

            <Select
                labelId={helperId}
                value={props.value ?? (form[props.name] || '')}
                defaultValue={props.defaultValue}
                label={props.label}
                onChange={e => (props.onChange ?? onFieldChange)(
                    props.name,
                    e.target.value || undefined
                )}
            >
                {props.options.map((option, i) => <MenuItem
                    key={i}
                    value={option.value}
                >{option.label}</MenuItem>)}
            </Select>
        </FormControl>

        {helperText && <FormHelperText
            id={helperId}
            sx={isError? { color: 'var(--c-error)' }: undefined}
        >
            {helperText}
        </FormHelperText>}
    </div>
}

export default SelectField;