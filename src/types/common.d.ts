import React from 'react';

declare global {
    type RSAny = Record<string, unknown>;

    /** Filter an object's keys by value type */
    type Constrain<T extends RSAny, C> = Pick<T,
        {[K in keyof T]: T[K] extends C? K: never}[keyof T]
    >;

    type Listener = (...args: unknown[]) => void;

    /** CommonJS Module */
    type CJS<T> = { default: T };

    /** React state */
    type State<T> = [T, React.Dispatch<React.SetStateAction<T>>];

    /** React.FC */
    type FC<Props = {}> = React.FC<React.PropsWithChildren<Props>>;
    /** React.FC with { className?: string } */
    type FCC<Props = {}> = FC<Props & { className?: string }>;

    type ColorMode = 'light'|'dark';
}

export {};