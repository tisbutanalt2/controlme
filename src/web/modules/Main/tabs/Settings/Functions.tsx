import { useEffect, useState, useMemo, Fragment } from 'react';
import { useSettingsContext } from '.';

import { defaultSettings } from '@utils/constants';
import controlFunctions, { sortedFunctions } from '@utils/controlFunctions';

import UI from '@components/ui';

import TabForm from './TabForm';


const FunctionSettings = () => {
    const [all, setAll] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const [settings, setSettings] = useSettingsContext();

    useEffect(() => {
        if (mounted) return;
        setMounted(true);
        
        const functions = { ...settings.functions };
        let update: boolean = false;

        for (const k in controlFunctions) {
            if (functions[k] === undefined) {
                update = true;
                functions[k] = defaultSettings.functions[k];
            }
        }

        update && setSettings(prev => ({ ...prev, functions }));
    }, [mounted]);

    useEffect(() => {
        if (!mounted) return;

        if (all) setSettings(prev => {
            const functions = { ...prev.functions };
            for (const k in functions) {
                functions[k] = true;
            }

            return ({
                ...prev,
                functions
            });
        });
    }, [all, mounted]);

    useEffect(() => {
        if (!Object.values(settings.functions).includes(false)) setAll(true);
        else setAll(false);
    }, [settings.functions]);

    const firstDangerous = useMemo(() => sortedFunctions
        .findIndex(f => f.dangerous),
        []
    );

    const firstVeryDangerous = useMemo(() => sortedFunctions
        .findIndex(f => f.veryDangerous),
        []
    );

    return <TabForm id="settings-functions" name="functions">
        <UI.Field
            name="all"
            type="switch"
            label="Enable all"
            description="Turns on ALL the functions, use with caution"
            value={all}
            onChange={v => {
                setAll(v);
                !v && setSettings(prev => {
                    const functions = { ...prev.functions };

                    for (const k in functions) {
                        functions[k] = v;
                    }

                    return ({
                        ...prev,
                        functions
                    });
                })
            }}
            warningLevel="high"
            warningMessage="Are you sure you want to enable ALL functions?"
        />

        <UI.MUI.Divider sx={{ mt: '8px' }} />
        <h2 style={{ marginBottom: '0' }}>Safe functions</h2>
        <UI.MUI.HelperText>These options are generally safe, but there is no guarantee that you won't run into issues</UI.MUI.HelperText>

        {sortedFunctions
            .map((func, i) => <Fragment key={i}>
                {i === firstDangerous && <>
                    <UI.MUI.Divider sx={{ mt: '8px' }} />
                    <h2 style={{ marginBottom: '0' }}>Potentially dangerous functions</h2>
                    <UI.MUI.HelperText>These options are somewhat unsafe, and are turned off by default</UI.MUI.HelperText>
                </>}

                {i === firstVeryDangerous && <>
                    <UI.MUI.Divider sx={{ mt: '8px' }} />
                    <h2 style={{ marginBottom: '0' }}>Very dangerous functions</h2>
                    <UI.MUI.HelperText>These options are dangerous, and WILL cause damage to your PC if access is given to the wrong person</UI.MUI.HelperText>
                </>}
                
                <UI.Field
                    key={i}
                    name={func.name}
                    type="switch"
                    label={func.title}
                    description={func.description}
                    // TODO
                    warningLevel={func.veryDangerous? 'high': (func.dangerous? 'medium': undefined)}
                    warningMessage={func.dangerousMessage}
                    disabled={func.requires? (
                        typeof func.requires === 'string'? !Boolean(settings.functions[func.requires])
                        :!(func.requires[func.requireAll? 'every':'some']((k: string) => Boolean(settings.functions[k])))
                    ): false}
                />
            </Fragment>)}
    </TabForm>
}

export default FunctionSettings;