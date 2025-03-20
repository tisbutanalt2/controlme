import configStore from '@stores/config';
import functions from 'functions';

export default function getFunctionAccess(
    overrides?: ControlMe.FunctionOverrides
): Set<string> {
    const set = new Set<string>();

    const base = configStore.get('functions');
    Object
        .entries(base)
        .forEach(([name, func]) => {
            if (func.enabled) {
                set.add(name);
                
                const f = functions.find(f => f.name === name);
                f?.additionalPermissions?.forEach(perm => {
                    configStore.get(`functions.${name}.options.${perm.name}`) && set.add(perm.name);
                });
            }
        });

    overrides?.forEach(override => {
        override.allow
            ? set.add(override.name)
            : set.delete(override.name);
    });

    return set;
}