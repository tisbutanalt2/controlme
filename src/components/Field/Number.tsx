import { useForm } from '@context/Form';
import clamp from '@utils/number/clamp';

import FormControl from '@muim/FormControl';
import OutlinedInput from '@muim/OutlinedInput';
import InputLabel from '@muim/InputLabel';
import FormHelperText from '@muim/FormHelperText';

export interface NumberFieldProps {
    defaultValue?: number;
    placeholder?: string;

    min?: number;
    max?: number;
    step?: number;

    onChange?(k: string, v: number): void;
}

const NumberField: FC<FieldBaseProps & NumberFieldProps> = props => {
    const { state: [form], errors, onFieldChange } = useForm();
    const helperId = props.description && `${props.id}-description`;

    const fieldError = errors?.[props.name];
    const helperText = fieldError || props.description;

    const isError = Boolean(fieldError);
    const value = clamp(
        Number((props.value ?? form[props.name]) || 0),
        props.min,
        props.max
    );

    return <div>
        <FormControl disabled={props.disabled} sx={props.sx}>
            {props.label && <InputLabel error={isError} htmlFor={props.id}>
                {props.label}
            </InputLabel>}

            <OutlinedInput
                id={props.id}
                label={props.label}
                error={isError}
                inputProps={{
                    type: 'number',
                    min: props.min,
                    max: props.max
                }}
                value={value}
                placeholder={props.placeholder}
                aria-describedby={helperId}
                onChange={e => (props.onChange ?? onFieldChange)(
                    props.name,
                    Number.isNaN(Number(e.currentTarget.value))? undefined: Number(e.currentTarget.value)
                )}
            />
        </FormControl>

        {helperText && <FormHelperText
            id={helperId}
            sx={isError? { color: 'var(--c-error)' }: undefined}
        >
            {helperText}
        </FormHelperText>}
    </div>
}

export default NumberField;