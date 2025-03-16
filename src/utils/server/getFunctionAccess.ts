import configStore from '@stores/config';

export default function getFunctionAccess(
    overrides?: ControlMe.FunctionOverrides
): Set<string> {
    const functions = new Set<string>();

    const base = configStore.get('functions');
    Object
        .entries(base)
        .forEach(([name, allow]) => {
            allow && functions.add(name);
        });

    overrides?.forEach(override => {
        override.allow && functions.add(override.name);
    });

    return functions;
}