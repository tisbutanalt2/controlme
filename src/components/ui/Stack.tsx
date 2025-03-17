import { default as MuiStack, StackProps } from '@muim/Stack';

const Stack: FC<StackProps> = ({ children, ...props }) => <MuiStack
    direction="row"
    alignItems="center"
    gap="8px"
    {...props}
>{children}</MuiStack>

export default Stack;