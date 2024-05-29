import { useEffect, useState, useMemo, Fragment } from 'react';
import { useSettingsContext } from '.';

import { defaultSettings } from '@utils/constants';
import controlFunctions, { sortedFunctions } from '@utils/controlFunctions';

import TabForm from './TabForm';
import Field from '@components/Field';
import Divider from '@muim/Divider';

import FormHelperText from '@muim/FormHelperText';

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
        <Field
            name="all"
            type="checkbox"
            label="Enable all"
            description="Turns on ALL the functions, use with caution"
            value={all}
            onChange={(k, v) => {
                setAll(v);
                !v && setSettings(prev => {
                    const functions = { ...prev.functions };

                    console.log(functions);
                    for (const k in functions) {
                        functions[k] = v;
                    }

                    return ({
                        ...prev,
                        functions
                    });
                })
            }}
            veryDangerous
            dangerousMessage="Are you sure you want to enable ALL functions?"
        />

        <Divider sx={{ mt: '8px' }} />
        <h2 style={{ marginBottom: '0' }}>Safe functions</h2>
        <FormHelperText>These options are generally safe, but there is no guarantee that you won't run into issues</FormHelperText>

        {sortedFunctions
            .map((func, i) => <Fragment key={i}>
                {i === firstDangerous && <>
                    <Divider sx={{ mt: '8px' }} />
                    <h2 style={{ marginBottom: '0' }}>Potentially dangerous functions</h2>
                    <FormHelperText>These options are somewhat unsafe, and are turned off by default</FormHelperText>
                </>}

                {i === firstVeryDangerous && <>
                    <Divider sx={{ mt: '8px' }} />
                    <h2 style={{ marginBottom: '0' }}>Very dangerous functions</h2>
                    <FormHelperText>These options are dangerous, and WILL cause damage to your PC if access is given to the wrong person</FormHelperText>
                </>}
                
                <Field
                    key={i}
                    name={func.name}
                    type="checkbox"
                    label={func.title}
                    description={func.description}
                    dangerous={func.dangerous}
                    veryDangerous={func.veryDangerous}
                    dangerousMessage={func.dangerousMessage}
                    disabled={func.requires? (
                        typeof func.requires === 'string'? !Boolean(settings.functions[func.requires])
                        :!(func.requires[func.requireAll? 'every':'some']((k: string) => Boolean(settings.functions[k])))
                    ): false}
                />
            </Fragment>)}
    </TabForm>
}

export default FunctionSettings;