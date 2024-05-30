# Control Me!
<img src="./assets/icon.png" width="64" height="64">

A fun app made with Electron to let others control your PC in various (mostly) safe ways!

## Features
**This list is subject to change.**

Features are marked with a checkbox which determines whether it has been implemented or not:

- [x] Change wallpaper
- [x] Image popups
- [ ] Video popups*
- [ ] Writing prompts*
- [ ] Play audio*
- [x] Open URLs
- [x] Access webcam
- [x] Take screenshots
- [x] Upload files and media
- [x] Autorun executable files
- [ ] Run terminal commands 

## Installation
The app is shipped with an installer. Download it and run it.

### Networking
The majority of people either can't, or don't know how to forward a port in their network.

Because of this, the app has built in support for [NGROK](https://ngrok.com).

1. [Create your NGROK account](https://dashboard.ngrok.com/signup)
2. [Copy your auth token](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Paste it in Settings > NGROK
4. Click Start, and a url to your NGROK tunnel should be displayed

**The port in which the server is hosted on can be controlled from Settings > Server.** If the number 0 is inserted, a random available port will be picked.

## Contributing
[Bun](https://bun.sh) was used to work on this, hence why each script in [package.json](./package.json) uses `bun` instead of regular [`node`](https://nodejs.org).
If you still wish to use NodeJS, check the [Using NodeJS](#using-nodejs) section.

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

### Using NodeJS
The project has been tested with Node V20.9.0.

Since Bun has built in ENV parsing, you'll need to install `cross-env`
```sh
npm install cross-env
```

To run this project in node, refer to the following commands:
```sh
npm run node:watch
npm run node:start
npm run node:build
```