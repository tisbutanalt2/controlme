import { useForm } from '@context/Form';

import FieldBase from './Base';
import MUI from '@appui/mui';

const NumberField: FC<UI.NumberFieldProps & UI.FieldBaseProps> = props => {
    const { state: [form] } = useForm();
    const isError = !!props.error;

    const parsedValue = Number(props.value ?? form[props.name]);
    const value = String(
        Number.isFinite(parsedValue)
            ? parsedValue
            : (props.defaultValueWhenEmpty ?? '')
    );

    return <FieldBase {...props} className="form-field-text">
        <MUI.FormControl disabled={props.disabled} sx={props.sx}>
            {props.label && <MUI.Label error={isError} htmlFor={props.id}>
                {props.label}
            </MUI.Label>}

            <MUI.OutlinedInput
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
                aria-describedby={props.helperId}
                onChange={e => {
                    if (!props.onChange) return;
                    const newValue = Number(e.currentTarget.value);

                    props.onChange(
                        Number.isFinite(newValue)
                            ?newValue
                            :undefined
                    );
                }}
            />
        </MUI.FormControl>

        {props.helperId && <MUI.HelperText
            id={props.helperId}
            error={isError}
        >
            {props.error || props.description}
        </MUI.HelperText>}
    </FieldBase>
}

export default NumberField;