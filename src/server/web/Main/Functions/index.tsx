import { useConnection } from '@web/Connection';
import { useEffect, useMemo, useState } from 'react';

import FunctionParamField from './FunctionParamField';

import UI from '@components/ui';
import combineClasses from '@utils/string/combineClasses';

const Functions = () => {
    const [activeFunction, setActiveFunction] = useState<string|undefined>();
    const [params, setParams] = useState<RSAny>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const connection = useConnection();
    const functions = useMemo(() => connection.functions
        .filter(func => !func.hidden && !func.custom),
        [connection.functions]
    );

    const currentActive = useMemo(() => functions.find(f => f.name === activeFunction), [activeFunction, functions]);

    useEffect(() => {
        if (!currentActive) return setErrors({});

        let errs: Record<string, string> = {};
        currentActive.parameters?.map(param => {
            if (param.required && [undefined, null, ''].includes(params[param.name] as undefined))
                return param.name;
        }).filter(name => !!name)
            .forEach(name => errs[name] = 'This field is required');

        setErrors(errs);
    }, [currentActive, params]);

    return <main>
        <h2>Control Functions</h2>
        <UI.Stack display="grid" gridTemplateColumns="1fr 1fr 1fr">
            {functions.map((func, i) => <UI.MUI.Card
                className={combineClasses('function-button', (currentActive?.name === func.name) && 'function-active')}
                key={i}
                sx={{ cursor: 'pointer', px: '24px' }}
                onClick={() => setActiveFunction(func.name)}
            >
                <h3 className="function-title">{func.title}</h3>
                <p className="function-description">{func.description}</p>
            </UI.MUI.Card>)}
        </UI.Stack>

        {currentActive && <UI.MUI.Dialog open onClose={() => {
            setActiveFunction(undefined);
            setParams({});
        }}>
            <UI.MUI.DialogTitle>{currentActive.title}</UI.MUI.DialogTitle>
            <UI.MUI.DialogContent>
                <UI.MUI.DialogContentText>{currentActive.description}</UI.MUI.DialogContentText>

                {currentActive.parameters?.map((param, i) => <FunctionParamField
                    {...param}
                    error={errors[param.name]}
                    key={i}
                    value={params[param.name]}
                    onChange={v => setParams(prev => ({
                        ...prev,
                        [param.name]: v
                    }))}
                />)}
            </UI.MUI.DialogContent>
            <UI.MUI.DialogActions>
                <UI.Button color="error" onClick={() => {
                    setActiveFunction(undefined);
                    setParams({});
                }}>Cancel</UI.Button>

                <UI.Button disabled={!!Object.keys(errors).length} color="success" onClick={() => {
                    if (Object.keys(errors).length) return;
                    connection.socket.emit('invokeFunction', currentActive.name, params, res => {
                        console.log(res);
                    });
                    setActiveFunction(undefined);
                    setParams({});
                }}>Send</UI.Button>
            </UI.MUI.DialogActions>
        </UI.MUI.Dialog>}
    </main>
}

export default Functions;