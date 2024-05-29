import { FunctionDef } from '.';
import { useWebErrorState } from '@context/WebError';

const Screenshot = () => {
    const [,setError] = useWebErrorState();

    return <FunctionDef
        name="screenshot"
        fields={[
            {
                name: 'screen',
                type: 'number',
                label: 'Monitor',
                min: 1,
                max: 10,
                description: 'Which monitor should be taken a screenshot of? (Currently doesn\'t check how many monitors are installed)',
                sx: { width: '100%' }
            }
        ]}
        parseArg={(form: { screen?: number }) => [
            form?.screen !== undefined? Math.max(form.screen - 1, 0): undefined
        ]}
        onRun={(data: string) => {
            const tab = window.open();
            if (!tab) return setError("Failed to open new tab. Please ensure that your browser doesn't block popups.");

            tab.document.body.setAttribute('style', 'margin: 0; height: 100%; background-color: rgb(14, 14, 14)');
            tab.document.body.innerHTML = `<img src="${data}" style="display: block;-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;" />`;
        }}
        onError={err => setError(err)}
    >
        Capture screenshot
    </FunctionDef>
}

export default Screenshot;