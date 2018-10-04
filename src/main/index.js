import { app, BrowserWindow, shell } from 'electron'
import path from 'path'
import { format as formatUrl } from 'url'

const fs      		= require('fs');
const openload 		= require('node-openload');              //to upload files to openload
var ipcMain 		= require('electron').ipcMain;

//const autoUpdater = require('electron-updater');
var app_config 		= {
    "version": app.getVersion(),
    "localStart": app.getPath("desktop"),
    "localCache": "",
    "title": "DreaMovies App",
    "window": {
        "width": 1400,
        "height": 1000,
        "minWidth": 1280,
        "minHeight": 800,
        "backgroundColor": "#232e4e"
    },
    "languageList": ["pt", "en", "es"],
    "language": "pt"
};

var ol = openload({
    api_login: 'a64a34a4c8e16c20',
    api_key: 'umPGoUXZ',
});

const home_path = app.getPath("documents");

const isDevelopment = process.env.NODE_ENV !== 'production'

app.on('ready', () => {
	let mainWindow = new BrowserWindow({
		width: 1024,
		frame: false,
		titleBarStyle: 'hidden',
	});
	if (isDevelopment) {
		mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
	} else {
		mainWindow.loadURL(formatUrl({
			pathname: path.join(__dirname, 'index.html'),
			protocol: 'file',
			slashes: true
		}))
	}
	mainWindow.on("closed", () => {
		mainWindow = null;
	});

    mainWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
    });
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on('web-contents-created', function(event, contents) {
    if (contents.getType() == 'webview') {
        contents.on('will-navigate', function(event, url) {
            event.preventDefault();
            shell.openExternal(url);
        });
    }
});

ipcMain.on('file_upload', function(event, path) {
    ol.upload({
        file: path,
        folder: "4349015"
    }).then(info => {
            console.log(info);
            event.sender.send('upload_status', info);
        }
    );   // Prints upload info
});


//resize window after loading Animation
ipcMain.on('end_loading', function(event) {

    mainWindow.setSize(app_config.width || 1280, app_config.height || 800, true);
    mainWindow.setMinimumSize(app_config.minWidth || 800, app_config.minHeight || 600);
    mainWindow.setResizable(true);
    mainWindow.setMovable(true);
    mainWindow.center();

});