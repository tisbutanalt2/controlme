import { useEffect, useState } from 'react'

const About = () => {
    const [version, setVersion] = useState<string|null>(null);

    useEffect(() => {
        window.ipc.getVersion().then(setVersion);
    }, []);

    return <>
        <p>
            Control Me! allows friends/strangers to control your computer in various ways.
            As the owner, you can control everything people get access to, even at user specific levels.
        </p>

        <p>
            You can easily share access to your computer, by creating a share link,
            which can be either a temporar link, or a permanent one.
        </p>

        <p>
            Optionally, you can turn all the security settings off, but this
            is highly unsafe! (obviously)
        </p>

        <br />

        <p>Made by <a target="_blank" href="https://reddit.com/u/tisbutanalt2">u/tisbutanalt2</a></p>
        <p>Code available on <a target="_blank" href="https://github.com/tisbutanalt2/controlme">GitHub</a></p>
        <p>Tunneled by <a target="_blank" href="https://ngrok.com">NGROK</a></p>

        {version && <div style={{ marginTop: '48px' }}>
            <pre>App version: {version}</pre>
        </div>}
    </>
}

export default About;