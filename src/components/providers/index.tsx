import ColorModeProvider from './ColorMode';
import IgnoreDangerousProvider from './IgnoreDangerous';
import PromptProvider from './Prompt';
import NgrokProvider from './Ngrok';

const Providers: FC = ({ children }) => <ColorModeProvider>
    <IgnoreDangerousProvider>
        <PromptProvider>
            <NgrokProvider>
                {children}
            </NgrokProvider>
        </PromptProvider>
    </IgnoreDangerousProvider>
</ColorModeProvider>

export default Providers;