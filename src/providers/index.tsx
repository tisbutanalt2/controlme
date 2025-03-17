import ColorModeProvider from './ColorMode';
import DisableWarningsProvider from './DisableWarnings';
import PromptProvider from './Prompt';
import NgrokProvider from './Ngrok';

const Providers: FC = ({ children }) => <ColorModeProvider>
    <DisableWarningsProvider>
        <PromptProvider>
            <NgrokProvider>
                {children}
            </NgrokProvider>
        </PromptProvider>
    </DisableWarningsProvider>
</ColorModeProvider>;

export default Providers;