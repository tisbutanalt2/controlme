import ColorModeProvider from './ColorMode';

const WebProviders: FC = ({ children }) => <ColorModeProvider noIpc>
    {children}
</ColorModeProvider>

export default WebProviders;