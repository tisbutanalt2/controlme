declare global {
    namespace UI {
        interface FieldBaseProps {
            name: string;

            id?: string;
            helperId?: string;

            label?: string;
            placeholder?: string;
            description?: string;

            disabled?: boolean;
            error?: string;

            value?: any;
            defaultValue?: any;

            onChange?(value: any): void;

            sx?: import('@muim/styles').SxProps;
        }

        interface TextFieldProps {
            value?: string;
            defaultValue?: string;

            password?: boolean;

            onChange?(v: string): void;
        }

        interface NumberFieldProps {
            value?: number;
            defaultValue?: number;
            defaultValueWhenEmpty?: number;

            min?: number;
            max?: number;
            step?: number;

            onChange?(v?: number): void;
        }

        interface CheckboxFieldProps {
            value?: boolean;
            defaultValue?: boolean;

            warningLevel?: 'medium'|'high';
            warningMessage?: string;
            warningOnFalse?: boolean;

            color?: import('@muim/Checkbox').CheckboxProps['color'];

            onChange?(v: boolean): void;
        }

        interface SelectFieldProps {
            value?: string;
            defaultValue?: string;

            options?: { label: string; value: string }[];
            onChange?(v?: string): void;
        }

        type FieldProps = FieldBaseProps & (
            ({ type: 'text' } & TextFieldProps) |
            ({ type: 'number'|'range' } & NumberFieldProps) |
            ({ type: 'checkbox'|'switch' } & CheckboxFieldProps) |
            ({ type: 'select' } & SelectFieldProps)
        )
    }
}

export {};