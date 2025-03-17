import { useEffect, useState } from 'react';
import { Link } from 'react-router';

const About = () => {
    const [version, setVersion] = useState<string|undefined>();

    useEffect(() => {
        window.ipcMain.version().then(setVersion);
    }, []);

    return <>
        <p>
            Control Me! allows friends/strangers to control your computer through various functions.
            As the owner, you can control everything people get access to, even at user specific levels.
        </p>

        <p>
            You can easily share access to your computer by creating a <Link to="/share">Share Link</Link>,
            which can be either a temporar link, or a permanent one.
        </p>

        <p>
            Optionally, you can turn all the security settings off, but this is highly unsafe! (obviously)
        </p>

        <br />

        <p>Made by <a href="https://reddit.com/u/tisbutanalt2" target="_blank" title="Go to Reddit User">u/tisbutanalt2</a></p>
        <p>Open source code available on <a href="https://github.com/tisbutanalt2/controlme" target="_blank" title="Go to GitHub Repository">GitHub</a></p>
        <p>Tunneled by <a href="https://ngrok.com" target="_blank" title="Go to Ngrok">Ngrok</a></p>

        {version && <div style={{ marginTop: '48px' }}>
            <pre>App version: {version}</pre>
        </div>}
    </>
}

export default About;