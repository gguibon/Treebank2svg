'use strict';
const { app, BrowserWindow, ipcMain } = require('electron');

// prevent window being garbage collected
let mainWindow;
let backgroundWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	backgroundWindow = null;
	backgroundWindow = null;
	mainWindow = null;
	mainWindow = null;
}

function createMainWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600
		// frame: false
	});

	// Open the DevTools.
 	// win.webContents.openDevTools()

	win.loadURL(`file://${__dirname}/renderer/index.html`);
	win.on('closed', onClosed);

	return win;
}

function createBackgroundWindow() {
	const win = new BrowserWindow({
		show: false
		// width: 400,
		// height: 200
	});

	win.loadURL(`file://${__dirname}/background/index.html`);
	// Open the DevTools.
 	win.webContents.openDevTools()

	return win;
}

// app.on('window-all-closed', () => {
// 	if (process.platform !== 'darwin') {
// 		app.quit();
// 	}
// });

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate-with-no-open-windows', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
	backgroundWindow = createBackgroundWindow();
});

// ipcMain.on('background-response', (event, payload) => mainWindow.webContents.send('background-response', payload));

// ipcMain.on('background-start', (event, payload, timeMax) => backgroundWindow.webContents.send('background-start', payload, timeMax));

ipcMain.on('background-response', (event, payload) => mainWindow.webContents.send('background-response', payload));

ipcMain.on('background-start', (event, payload) => backgroundWindow.webContents.send('background-start', payload));