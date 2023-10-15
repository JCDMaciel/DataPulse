const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { readCSV } = require('./src/models/csvModel');

let mainWindow;

function createMainWindow(data) {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 1200,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // Carrega o arquivo HTML na janela principal
    mainWindow.loadFile(path.join(__dirname, 'src/views/index.html'));

    // Envia os dados para a janela principal após o carregamento
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('csv-data', data);
    });

    // Manipula o evento de recarregar o aplicativo
    ipcMain.on('reload-app', () => {
        const currentWindow = BrowserWindow.getFocusedWindow();

        // Fecha a janela atual se existir
        if (currentWindow) {
            currentWindow.close();
        }

        // Cria uma nova janela principal com os dados
        createMainWindow(data);
    });

    return mainWindow;
}

app.whenReady().then(() => {
    readCSV(path.join(__dirname, 'dados', 'arquivo.csv'), (data) => {
        createMainWindow(data);
    });

    app.on('activate', () => {
        if (!mainWindow) {
            createMainWindow();
        }
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
});
