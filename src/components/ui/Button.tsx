import { default as MuiButton, type ButtonProps } from '@muim/Button';

const Button: FC<ButtonProps> = ({ children, ...props }) => <MuiButton
    variant="outlined"
    {...props}
>{children}</MuiButton>

export default Button;