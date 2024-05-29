import { useState, useCallback } from 'react';
import PromptContext, { PromptCaller } from '@context/Prompt';

import Prompt, { PromptProps } from '@components/Prompt';

/** Provides a callback to display MUI prompts */
const PromptProvider: FC = ({ children }) => {
    const [prompts, setPrompts] = useState<PromptProps[]>([]);

    const caller = useCallback<PromptCaller>(props => {
        return new Promise<{ action: string; form?: RSAny }|null>((res) => {
            setPrompts(prev => {
                const base: Omit<PromptProps, 'onClose'> = {
                    ...props,
                    open: true,
                    onAction: (action, form) => res({ action, form })
                };
    
                (base as PromptProps).onClose = () => {
                    setPrompts(p => {
                        setTimeout(() => {
                            setPrompts(p => {
                                return p.filter(obj => obj !== base);
                            });
                        }, 1000);

                        base.open = false;
                        return [...p];
                    });
                    res(null);
                }
    
                return [...prev, base as PromptProps];
            });
        });
    }, []);

    return <>
        {prompts?.map((prompt, i) => <Prompt
            key={i}
            {...prompt}
        />)}

        <PromptContext.Provider value={caller}>
            {children}
        </PromptContext.Provider>
    </>
}

export default PromptProvider;