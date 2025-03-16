declare global {
    namespace ControlMe {
        interface FunctionOverride {
            name: string;
            allow: boolean;
        }

        type FunctionOverrides = Array<FunctionOverride>;
    
        interface FunctionField {
            name: string;
            type: import('enum').FieldType;
        }
    
        interface Function {
            title: string;
            description: string;
    
            dangerLevel?: import('enum').DangerLevel;
            defaultEnabled?: boolean;
    
            /** Optional warning message to show when enabling the function */
            warning?: string;
    
            /** Will issue the warning when the function is disabled */
            warnOnFalse?: boolean;

            /** Additional options the function can have changed */
            options?: Record<string, FunctionField>;
    
            /** Optional function to validate passed args. Return a string to show an error. */
            validateArgs?: (...args: unknown[]) => string|boolean;
    
            /** Function handler */
            handler: (...args: unknown[]) => unknown|Promise<unknown>;
        }
    }
}

export {};