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
            dangerLevel?: import('enum').DangerLevel;
            defaultValue?: unknown;
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
        });

        interface FunctionParamField {
            name: string;
            type: import('enum').FieldType | Array<import('enum').FieldType>;
            label?: string;
            description?: string;
            required?: boolean;
            requiredPermission?: string|Array<string>;
            defaultValue?: unknown;

            sx?: import('@muim/styles').SxProps;

            fileType?: import('enum').FileType | Array<import('enum').FileType>;
            folderType?: import('enum').FolderType | Array<import('enum').FolderType>;

            /** Optional glob pattern for file types if field is of type File */
            glob?: string;

            /** Allows text fields to write across multiple lines */
            multiline?: boolean;
        }

        interface StoredFunction {
            enabled: boolean;
            options?: Record<string, unknown>;
        }
    
        interface FunctionResultObject {
            success: boolean;
            errorMessage?: string;
            [k: string]: unknown;
        }

        type FunctionResult = string | undefined | true | FunctionResultObject;

        interface Function<Props = RSAny, Options = RSAny> {
            /** Unique function name */
            name: string;

            /** True if the function shouldn't be considered callable */
            hidden?: boolean;

            /** True if the function is rendered by a custom react component */
            custom?: boolean;

            /** Additional permission keys used when checking access */
            additionalPermissions?: Array<{ name: string; label?: string }>;

            title: string;
            description: string;

            /** If the function only supports a specific OS, this can be filled */
            supportedOs?: string|Array<string>;

            /** Description displayed to the user. Defaults to the description. */
            userDescription?: string;
    
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
                parameters: Props,
                options: Options,
                permissions: Set<string>,
                user: Auth.User
            ) => string|boolean;
    
            /** Function handler */
            handler?: (parameters: Props, options: Options, user: Auth.User) => FunctionResult|Promise<FunctionResult>;
        }

        type ReducedFunction = Omit<
            ControlMe.Function,
            'handler' |
            'validateArgs' |
            'options' |
            'dangerLevel' |
            'defaultEnabled' |
            'warning' |
            'warnOnFalse' |
            'userDescription'
        >;
    }
}

export {};