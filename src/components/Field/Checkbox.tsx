import { useCallback } from 'react';

import { useForm } from '@context/Form';
import { usePromptCaller } from '@context/Prompt';
import { useIgnoreDangerous } from '@context/IgnoreDangerous';

import { default as MuiCheckbox, CheckboxProps as MuiCheckboxProps } from '@muim/Checkbox';
import FormControlLabel from '@muim/FormControlLabel';
import FormHelperText from '@muim/FormHelperText';
import Stack from '@muim/Stack';

import { dangerousOption } from '@utils/prompts';

export interface CheckboxProps {
    defaultValue?: boolean;
    color?: MuiCheckboxProps['color'];
    
    onChange?(k: string, v: boolean): void;
}

const Checkbox: FC<FieldBaseProps & CheckboxProps> = props => {
    const { state: [form], onFieldChange } = useForm();
    const ignoreDangerous = useIgnoreDangerous();

    const helperId = props.description && `${props.id}-description`;

    const promptCaller = usePromptCaller();
    const value = Boolean((props.value ?? form[props.name]) || false) ?? props.defaultValue;

    const onChange = useCallback((v: boolean) => {
        const runChange = () => (props.onChange ?? onFieldChange)(props.name, v);

        if (v && (props.veryDangerous || props.dangerous) && !ignoreDangerous)
            dangerousOption(promptCaller, props.dangerousMessage || props.veryDangerous).then(confirmed => confirmed && runChange());
        else
            runChange();
    }, [
        props.name,
        props.dangerous,
        props.veryDangerous,
        props.dangerousMessage,
        ignoreDangerous
    ]);

    return <Stack sx={{ display: 'inline-flex' }}>
        <FormControlLabel
            sx={{ pointerEvents: 'none', ...props.sx }}
            control={<MuiCheckbox
                color={props.color ?? (props.veryDangerous? 'error': (props.dangerous? 'warning': undefined))}
                sx={{ pointerEvents: 'auto' }}
                disabled={props.disabled}
                defaultChecked={props.defaultValue}
                checked={value}
                aria-describedby={helperId}
                onChange={(e, v) => onChange(v)}
                onKeyDown={e => e.code === 'Enter' && onChange(!value)}
            />}
            label={props.label}
            disabled={props.disabled}
        />

        {props.description && <FormHelperText sx={{ ml: '32px', mt: '-8px' }} id={helperId}>
            {props.description}
        </FormHelperText>}
    </Stack>
}

export default Checkbox;