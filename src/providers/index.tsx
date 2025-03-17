import ColorModeProvider from './ColorMode';

const Providers: FC = ({ children }) => <ColorModeProvider>
    {children}
</ColorModeProvider>;

export default Providers;