import { useCallback, useEffect, useState, Fragment } from 'react';
import { useSettingsContext } from '.';

import { Link } from 'react-router';
import { FieldType } from 'enum';

import UI from '@components/ui';
import Switch from '@appui/Field/Switch';

const FunctionSettings = () => {
    const [settings, setSettings] = useSettingsContext();

    const [functions, setFunctions] = useState<Array<Omit<ControlMe.Function, 'handler'|'validateArgs'>>>([]);
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        if (mounted) return;
        setMounted(true);

        window.ipcMain.getFunctions().then(setFunctions);
    }, [mounted]);

    const setOption = useCallback((name: string, key: string, v: unknown) => {
        const functionIndex = functions.findIndex(f => f.name === name);
        if (functionIndex < 0) return;

        const f = functions[functionIndex];

        setSettings(prev => {
            const copy = { ...prev, functions: { ...prev.functions } };
            if (!copy.functions[name]) copy.functions[name] = {
                enabled: f.defaultEnabled,
                options: {}
            };

            const func = copy.functions[name];
            if (key === 'enabled') func.enabled = Boolean(v);
            else func.options[key] = v;

            return copy;
        });
    }, [functions]);

    return <>
        <UI.MUI.HelperText>
            You can control every single function
            the app has to offer. <Link to="/share">Share Links</Link> with
            access overrides will naturally ignore
            settings defined for the functions they override.
        </UI.MUI.HelperText>

        <UI.MUI.Divider sx={{ my: '8px' }} />

        {functions.map((f, i) => {
            const functionSettings = settings.functions[f.name];

            return <Fragment key={i}>
                <Switch
                    label={f.title}
                    value={Boolean(functionSettings?.enabled)}
                    onChange={v => setOption(f.name, 'enabled', v)}
                />

                <UI.MUI.HelperText>
                    {f.description}
                </UI.MUI.HelperText>

                {functionSettings?.enabled && <div className="function-options">
                    {f.options?.map((opt, fi) => {
                        const value = functionSettings.options?.[opt.name];
                        let elem: JSX.Element = null;

                        switch(opt.type) {
                            case FieldType.String:
                                elem = <UI.Field
                                    type="text"
                                    label={opt.label ?? opt.name}
                                    value={String(value)}
                                    defaultValue={opt.defaultValue as string}
                                    onChange={v => setOption(f.name, opt.name, v)}
                                />
                                break;
                            case FieldType.Number:
                                elem = <UI.Field
                                    type="number"
                                    label={opt.label ?? opt.name}
                                    value={value as number|undefined}
                                    defaultValue={opt.defaultValue as number}
                                    allowEmpty
                                    onChange={v => setOption(f.name, opt.name, v)}
                                    min={opt.min}
                                    max={opt.max}
                                    step={opt.step}
                                />
                                break;
                            case FieldType.Boolean:
                                elem = <UI.Field
                                    type="checkbox"
                                    label={opt.label ?? opt.name}
                                    value={Boolean(value)}
                                    defaultValue={opt.defaultValue as boolean}
                                    onChange={v => setOption(f.name, opt.name, v)}
                                />
                                break;
                        }

                        return <Fragment key={fi}>
                            {elem}
                            {opt.description && <UI.MUI.HelperText>
                                {opt.description}
                            </UI.MUI.HelperText>}
                            {i < (functions.length - 1) && fi === (f.options.length - 1) && <UI.MUI.Divider sx={{ mt: '14px' }} />}
                        </Fragment>;
                    })}    
                </div>}
            </Fragment>
        })}
    </>
}

export default FunctionSettings;