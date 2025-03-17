import { useForm } from '@context/Form';

import FieldBase from './Base';
import MUI from '@appui/mui';

const Select: FC<UI.SelectFieldProps & UI.FieldBaseProps> = props => {
    const { state: [form] } = useForm();
    const isError = !!props.error;

    return <FieldBase {...props} className="form-field-text">
        <MUI.FormControl disabled={props.disabled} sx={props.sx}>
            {props.label && <MUI.Label error={isError} htmlFor={props.id}>
                {props.label}
            </MUI.Label>}

            <MUI.Select
                labelId={props.helperId}
                value={(props.value ?? form[props.name]) ?? ''}
                label={props.label}
                //placeholder={props.placeholder}
                onChange={e => props.onChange?.(e.target.value ?? undefined)}
            >
                {props.options?.map((option, i) => <MUI.MenuItem
                    key={i}
                    value={option.value as string}
                >{option.label}</MUI.MenuItem>)}
            </MUI.Select>
        </MUI.FormControl>

        {props.helperId && <MUI.HelperText
            id={props.helperId}
            error={isError}
        >
            {props.error || props.description}
        </MUI.HelperText>}
    </FieldBase>
}

export default Select;