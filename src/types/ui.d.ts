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
            onChange?(value: any): void;

            sx?: import('@muim/styles').SxProps;
        }

        interface TextFieldProps {
            defaultValue?: string;
            password?: boolean;

            onChange?(v: string): void;
        }

        interface NumberFieldProps {
            defaultValue?: number;
            min?: number;
            max?: number;
            step?: number;

            onChange?(v: number): void;
        }

        interface CheckboxFieldProps {
            defaultValue?: boolean;

            onChange?(v: boolean): void;
        }

        type FieldProps = FieldBaseProps & (
            ({ type: 'text' } & TextFieldProps) |
            ({ type: 'number'|'range' } & NumberFieldProps) |
            ({ type: 'checkbox'|'switch' & CheckboxFieldProps })
        )
    }
}

export {};