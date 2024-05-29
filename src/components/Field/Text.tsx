import { useForm } from '@context/Form';

import FormControl from '@muim/FormControl';
import OutlinedInput from '@muim/OutlinedInput';
import InputLabel from '@muim/InputLabel';
import FormHelperText from '@muim/FormHelperText';

export interface TextFieldProps {
    defaultValue?: string;
    placeholder?: string;

    password?: boolean;

    onChange?(k: string, v: string): void;
}

const TextField: FC<FieldBaseProps & TextFieldProps> = props => {
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

            <OutlinedInput
                id={props.id}
                label={props.label}
                error={isError}
                type={props.password? 'password': undefined}
                value={String((props.value ?? form[props.name]) || '')}
                placeholder={props.placeholder}
                aria-describedby={helperId}
                onChange={e => (props.onChange ?? onFieldChange)(
                    props.name,
                    e.currentTarget.value || ''
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

export default TextField;