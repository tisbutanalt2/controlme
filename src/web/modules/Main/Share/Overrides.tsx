import { useEffect, useState, useMemo, useCallback } from 'react';

import { useFormState } from '@context/Form';
import type { ShareForm } from '.';

import UI from '@components/ui';

import ToggleButtonGroup from '@muim/ToggleButtonGroup';
import ToggleButton from '@muim/ToggleButton';

import CheckIcon from '@muii/Check';
import CloseIcon from '@muii/Close';
import RemoveIcon from '@muii/Remove';

export const Override: FC<{
    label: string;
    allow?: boolean;
    onChange: (v?: boolean) => void;
}> = props => <UI.Stack mt="12px" gap="12px">
    <ToggleButtonGroup
        value={props.allow ? 'allow' : (props.allow === false ? 'disallow' : 'unset')}
        exclusive
        onChange={(_e, v: string) => props.onChange(
            v === 'allow' ?
                true :
            v === 'disallow' ?
                false :
            undefined
        )}
    >
        <ToggleButton color="error" value="disallow">
            <CloseIcon color="error" />
        </ToggleButton>

        <ToggleButton value="unset">
            <RemoveIcon />
        </ToggleButton>

        <ToggleButton color="success" value="allow">
            <CheckIcon color="success" />
        </ToggleButton>
    </ToggleButtonGroup>

    <div>{props.label}</div>
</UI.Stack>

const Overrides = () => {
    const [functions, setFunctions] = useState<Array<ControlMe.ReducedFunction>>([]);
    const [form, setForm] = useFormState() as State<ShareForm>;

    const permissionKeys = useMemo<Array<{ key: string; label: string }>>(() => functions.map(f => [
        {
            key: f.name,
            label: f.title ?? f.name
        },

        ...(f.additionalPermissions?.length ? f.additionalPermissions.map(p => ({
            key: p.name,
            label: p.label ?? p.name
        })) : [])
    ]).flat(), [functions]);

    useEffect(() => {
        if (functions.length) return;
        window.ipcMain.getFunctions().then(setFunctions);
    }, [functions.length]);

    const setPermission = useCallback((k: string, v?: boolean) => {
        setForm(prev => {
            const copy = { ...prev, functionOverrides: [ ...prev.functionOverrides ] };

            let index = copy.functionOverrides.findIndex(p => p.name === k);
            if (index < 0) {
                if (v === undefined) return prev;
                copy.functionOverrides.push({
                    name: k,
                    allow: v
                });
                index = copy.functionOverrides.length - 1;
            }

            if (typeof v === 'boolean') copy.functionOverrides[index].allow = v;
            else copy.functionOverrides.splice(index, 1);

            return copy;
        });
    }, []);

    if (!permissionKeys.length) return;
    return <>
        <h2>Function Overrides</h2>

        <UI.MUI.HelperText>
            You may set custom overrides for this link.
            <br />
            Users who access your app through the link will have
            function overrides equivalent to those of the link used.
            These can later be changed at a user specific level.
        </UI.MUI.HelperText>

        {permissionKeys.map((p, i) => {
            const current = form.functionOverrides?.find(override => override.name === p.key);

            return <Override
                key={i}
                label={p.label}
                allow={current?.allow}
                onChange={v => setPermission(p.key, v)}
            />
        })}
    </>
}

export default Overrides;