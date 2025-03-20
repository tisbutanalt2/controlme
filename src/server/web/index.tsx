import { createRoot } from 'react-dom/client';
import App from './App';

const rootDiv = document.querySelector('div#root');
const root = createRoot(rootDiv);

window.onerror = err => {
    root.render(<main>
        <h2>An error ocurred</h2>
        <pre className="error">{String((err instanceof Error) ? err.message : err).replace(/^(Uncaught )?(Error)|(Exception): /, '')}</pre>
    </main>)
}

root.render(<App />);