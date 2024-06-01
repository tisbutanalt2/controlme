import { useCallback } from 'react';

import { usePromptCaller } from '@context/Prompt';
import { useForm } from '@context/Form';

import { dangerousOption } from '@utils/prompts';

import FieldBase from './Base'
import MUI from '@appui/mui';

const Checkbox: FC<UI.FieldBaseProps & UI.CheckboxFieldProps> = props => {
    const { state: [form] } = useForm();
    const isError = !!props.error;

    const promptCaller = usePromptCaller();
    const onChange = useCallback((v: boolean) => {
        const handleChange = () => props.onChange?.(v);

        if (
            ['medium', 'high'].includes(props.warningLevel) &&
            (props.warningOnFalse? !v: v)
        )
            dangerousOption(promptCaller, props.warningMessage ?? props.warningLevel)
                .then(confirmed => confirmed && handleChange());
        else
            handleChange();
    }, [
        promptCaller,
        props.onChange,
        props.warningLevel,
        props.warningMessage,
        props.warningOnFalse
    ]);

    return <FieldBase {...props} className="form-field-checkbox">
        <MUI.FormControlLabel
            label={props.label}
            disabled={props.disabled}

            sx={{ pointerEvents: 'none', ...props.sx }}
            control={<MUI.Checkbox
                color={props.color ?? (
                    props.warningLevel === 'high'
                        ? 'error'
                    :props.warningLevel === 'medium'
                        ? 'warning'
                    :undefined
                )}
                sx={{ pointerEvents: 'auto' }}
                checked={!!(props.value ?? form[props.name])}
                aria-describedby={props.helperId}
                onChange={(e, v) => onChange(v)}
                onKeyDown={e => e.code === 'Enter' && onChange(!props.value)}
            />}
        />

        {props.helperId && <MUI.HelperText
            id={props.helperId}
            error={isError}
        >
            {props.error || props.description}
        </MUI.HelperText>}
    </FieldBase>
}

export default Checkbox;