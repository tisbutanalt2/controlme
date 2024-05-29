declare global {
    interface FieldBaseProps {
        name: string;
        id: string;

        label?: string;
        placeholder?: string;
        description?: string;

        disabled?: boolean;

        dangerous?: boolean;
        veryDangerous?: boolean;

        dangerousMessage?: string;

        value?: any;
        onChange?(k: string, value: any): void;

        sx?: import('@mui/material/styles').SxProps;
    }
}

export {}