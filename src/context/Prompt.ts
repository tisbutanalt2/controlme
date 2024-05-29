import { createContext, useContext } from 'react';
import { PromptBaseProps } from '@components/Prompt';

export type PromptCaller = (props: PromptBaseProps) => Promise<{
    action: string;
    form?: RSAny;
}|null>;

const PromptContext = createContext<PromptCaller>(() => Promise.resolve<any>(null));
export const usePromptCaller = () => useContext(PromptContext);

export default PromptContext;