import { default as MuiButton, ButtonProps } from '@muim/Button';

const Button: FC<ButtonProps> = ({ children, ...props }) => <MuiButton
    variant="outlined"
    {...props}
>{children}</MuiButton>

export default Button;