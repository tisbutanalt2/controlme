import { createContext, useContext } from 'react';

interface FormCTX<T = RSAny> {
    id: string;
    state: State<T>;
    errors?: Record<string, string|null|false>;
    onFieldChange(k: string, v: any): void;
}

const FormContext = createContext<FormCTX>({
    id: '',
    state: [{}, () => {}],
    onFieldChange: () => {}
});

export const useForm = <T = RSAny>() => (useContext(FormContext)) as FormCTX<T>;
export const useFormState = <T = RSAny>() => useForm<T>().state;

export default FormContext;