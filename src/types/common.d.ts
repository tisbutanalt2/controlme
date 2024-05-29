declare global {
    type RSAny = Record<string, any>;

    /** Filter an object on the given condition */
    type Constrain<T extends RSAny, C> = Pick<T,
        {[K in keyof T]: T[K] extends C? K: never}[keyof T]
    >;

    type Listener = (...args: any[]) => void;

    /** CommonJS Module */
    type CJS<T> = { default: T };

    /** React state */
    type State<T> = [T, React.Dispatch<React.SetStateAction<T>>];

    /** React.FC */
    type FC<Props = {}> = React.FC<React.PropsWithChildren<Props>>;

    type ColorMode = 'light'|'dark';
}

export {}