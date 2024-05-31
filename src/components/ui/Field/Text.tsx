import FieldBase from './Base';
import MUI from '@appui/mui';

const TextField: FC<UI.TextFieldProps & UI.FieldBaseProps> = props => {
    const isError = !!props.error;

    return <FieldBase {...props} className="form-field-text">
        <MUI.FormControl disabled={props.disabled} sx={props.sx}>
            {props.label && <MUI.Label error={isError} htmlFor={props.id}>
                {props.label}
            </MUI.Label>}

            <MUI.OutlinedInput
                id={props.id}
                label={props.label}
                error={isError}
                type={props.password? 'password': 'undefined'}
                value={String(props.value || '')}
                placeholder={props.placeholder}
                aria-describedby={props.helperId}
                onChange={e => props.onChange?.(e.currentTarget.value || '')}
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

export default TextField;