const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const notifier = require('node-notifier');
const { readCSV } = require('./src/models/csvModel');
const { ipcRenderer } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 1200,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    readCSV('./dados/arquivo.csv', data => {
        win.webContents.send('csv-data', data);
        console.log('Os dados do arquivo CSV foram lidos com sucesso.');
    });

    win.loadFile(path.join(__dirname, 'src/views/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('reload-app', () => {
    const currentWindow = BrowserWindow.getFocusedWindow();

    createWindow();

    if (currentWindow) {
        currentWindow.close();
    }
});

