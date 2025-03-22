# Control Me!
<img src="./assets/icon.png" width="64" height="64">

A fun app made with Electron to let others control your PC in various (mostly) safe ways!

## Features
**This list is subject to change.**

Features are marked with a checkbox which determines whether it has been implemented or not:

- [x] User authentication (anonymous, login, discord)
- [x] Ngrok tunneling (no need to port forward)
- [ ] Change wallpaper
- [ ] Image popups
- [ ] Video popups
- [x] Writing prompts
- [ ] Play audio
- [x] Open URLs
- [ ] Webcam photo
- [ ] Take screenshots
- [ ] Upload files
- [ ] Automatically run exe-files
- [ ] Automatically extract zip-files
- [ ] Run terminal commands

## Installation
The app is shipped with an installer. Download it and run it.

When updates are released, simply download the new installer and run it.
The installer will overwrite the previous version of the app.

**Please follow the [Tutorial](./tutorial.md) once the app is installed**

### Networking
The majority of people either can't, or don't know how to forward a port in their network.

Because of this, the app has built in support for [Ngrok tunneling](https://ngrok.com).

1. [Create your Ngrok account](https://dashboard.ngrok.com/signup)
2. [Copy your Authentication Token](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Paste it in Settings > Ngrok
4. Click Start, and a url to your Ngrok tunnel should be displayed

**The port in which the server is hosted on can be controlled from Settings > Server.** If the number 0 is inserted, a random available port will be picked.

## Contributing
[Bun](https://bun.sh) was used to work on this, hence why each script in [package.json](./package.json) uses `bun` instead of regular [`node`](https://nodejs.org).
NodeJS is however still compatible.

### 1. Clone the repository, and install the required packages
```sh
git clone https://github.com/tisbutanalt2/controlme
cd controlme
bun install # or npm install
```

### 2. Launch 2 separate terminals. One will be to compile the code, the other will be to launch Electron.
Terminal 1:
```sh
bun watch # or npm run node:watch
```

Terminal 2:
```sh
bun start # or npm run node:start
```

### 3. Building the app:
```sh
bun run build # or npm run node:build
```

### 4. Discord authentication
If you wish to enable discord authentication, you will need to set up or use a third party authentication server.
See [Control Me Auth](https://github.com/tisbutanalt2/controlme-auth) if you wish to set up your own auth server.

**Steps to set up Discord authentication:**
1. Get the URL to a Control Me authentication server (must be a trusted source)
2. Paste the server URL in Settings > Security > Authentication server
3. Go to share, and select the link type "Discord" to copy a link