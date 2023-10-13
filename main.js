const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const notifier = require('node-notifier');
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

        notifier.notify({
            title: 'Dados do CSV lidos!',
            message: 'Os dados do arquivo CSV foram lidos com sucesso.',
            icon: path.join(__dirname, 'path-to-your-icon.png'),
        });
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
