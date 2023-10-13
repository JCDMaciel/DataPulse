const { app, BrowserWindow } = require('electron');
const path = require('path');
const { readCSV } = require('./src/models/csvModel');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    readCSV('./dados/arquivo.csv', data => {
        win.webContents.send('csv-data', data);
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
