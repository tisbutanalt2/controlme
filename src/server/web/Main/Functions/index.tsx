import { useConnection } from '@web/Connection';
import { useMemo, useState } from 'react';

import UI from '@components/ui';
import combineClasses from '@utils/string/combineClasses';

const Functions = () => {
    const [activeFunction, setActiveFunction] = useState<string|undefined>();

    const connection = useConnection();
    const functions = useMemo(() => connection.functions
        .filter(func => !func.hidden && !func.custom),
        [connection.functions]
    );

    const currentActive = useMemo(() => functions.find(f => f.name === activeFunction), [activeFunction, functions]);

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
    </main>
}

export default Functions;