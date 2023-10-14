const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { readCSV } = require('./src/models/csvModel');

/**
 * Cria e configura a janela principal.
 * @returns {BrowserWindow} A instância da janela principal.
 */
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 1200,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // Leitura do arquivo CSV e envio dos dados para a janela principal
    readCSV('./dados/arquivo.csv', (data) => {
        mainWindow.webContents.send('csv-data', data);
        console.log('Os dados do arquivo CSV foram lidos com sucesso.');
    });

    // Carrega o arquivo HTML na janela principal
    mainWindow.loadFile(path.join(__dirname, 'src/views/index.html'));

    return mainWindow;
}

// Quando o aplicativo estiver pronto, cria a janela principal
app.whenReady().then(() => {
    const mainWindow = createMainWindow();

    // Ativa a janela principal se não houver janelas abertas
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

// Encerra o aplicativo quando todas as janelas forem fechadas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

/**
 * Manipula o evento de recarregar o aplicativo.
 * Fecha a janela atual e cria uma nova.
 */
ipcMain.on('reload-app', () => {
    const currentWindow = BrowserWindow.getFocusedWindow();

    // Cria uma nova janela principal
    const mainWindow = createMainWindow();

    // Fecha a janela atual se existir
    if (currentWindow) {
        currentWindow.close();
    }
});
