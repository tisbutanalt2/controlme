import { default as MuiHelperText, FormHelperTextProps } from '@muim/FormHelperText';

const HelperText: FC<FormHelperTextProps> = ({ children, ...props }) => <MuiHelperText
    {...props}
>{children}</MuiHelperText>

export default HelperText;