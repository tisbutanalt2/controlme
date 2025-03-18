declare global {
    namespace ControlMe {
        interface FunctionOverride {
            name: string;
            allow: boolean;
        }

        type FunctionOverrides = Array<FunctionOverride>;
    
        type FunctionField = {
            name: string;
            type: import('enum').FieldType;
            label?: string;
            description?: string;
        } & ({
            type: import('enum').FieldType.Number;
            min?: number;
            max?: number;
            step?: number;
        } | {
            type: import('enum').FieldType.Array |
            import('enum').FieldType.Boolean |
            import('enum').FieldType.Object |
            import('enum').FieldType.String
        })

        interface FunctionParamField {
            name: string;
            type: import('enum').FieldType | Array<import('enum').FieldType>;
            label?: string;
            description?: string;
            required?: boolean;
            requiredPermission?: string|Array<string>;
            defaultValue?: unknown;
        }

        interface StoredFunction {
            enabled: boolean;
            options?: Record<string, unknown>;
        }
    
        type FunctionResult = string | true | {
            success: boolean;
            isError?: boolean;
            errorMessage?: string;
            [k: string]: unknown;
        };

        interface Function {
            /** Unique function name */
            name: string;

            /** Additional permission keys used when checking access */
            additionalPermissions?: Array<{ name: string; label?: string }>;

            title: string;
            description: string;
    
            dangerLevel?: import('enum').DangerLevel;
            defaultEnabled?: boolean;
    
            /** Optional warning message to show when enabling the function */
            warning?: string;
    
            /** Will issue the warning when the function is disabled */
            warnOnFalse?: boolean;

            /** Additional options the function can have changed */
            options?: Array<FunctionField>;
    
            /** Optional array of parameters */
            parameters?: Array<FunctionParamField>;

            /** Optional function to validate passed args. Return a string to show an error. */
            validateArgs?: (
                parameters: Record<string, unknown>,
                permissions: Set<string>,
                user: Auth.User
            ) => string|boolean;
    
            /** Function handler */
            handler: (options: object) => FunctionResult|Promise<FunctionResult>;
        }

        type ReducedFunction = Omit<ControlMe.Function, 'handler'|'validateArgs'>
    }
}

export {};