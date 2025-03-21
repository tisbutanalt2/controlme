import configStore from '@stores/config';

import functions from 'functions';
import getFunctionAccess from './getFunctionAccess';

import log from 'log';
import userLabel from '@utils/string/userLabel';

export default async function invokeFunction(name: string, user: Auth.User, props: RSAny): Promise<ControlMe.FunctionResultObject> {
    const func = functions.find(f => f.name === name);
    if (!func || func.hidden || !func.handler) return { success: false, errorMessage: 'This function is not implemented' };

    const access = getFunctionAccess(user.functionOverrides);
    if (!access.has(name)) return { success: false, errorMessage: 'You do not have access to use this function' };

    if (func.parameters?.filter(p => !!p.requiredPermission).find(p => {
        return ((p.requiredPermission instanceof Array) ? p.requiredPermission : [p.requiredPermission])
            .some(p => !access.has(p));
    })) return { success: false, errorMessage: 'You do not have access to one or more parameters passed' };

    log(`${userLabel(user)} called function ${name} with parameters:\n${JSON.stringify(props, null, 4)}`);
    const options = (configStore.get(`functions.${name}.options`) || {}) as RSAny;

    const validateRes = func.validateArgs?.(
        props,
        options,
        access,
        user
    );

    if (validateRes !== undefined && validateRes !== true) {
        return {
            success: false,
            errorMessage: (typeof validateRes === 'string'
                ? validateRes
                : 'Unknown error'
            )
        };
    }

    // Props are valid, run the command
    try {
        const result = await func.handler(props, options || {}, user);
        if (typeof result === 'string') return { success: false, errorMessage: result };

        if (typeof result === 'object') {
            if (!result.success) return { success: false, errorMessage: result.errorMessage ?? 'The function failed to run successfully' };
            return result;
        }

        return { success: true };
    } catch(err) {
        log(`Function error: ${err}`, 'error');
        return { success: false, errorMessage: 'An error ocurred' };
    }
}