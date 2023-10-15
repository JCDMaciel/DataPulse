const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { readCSV } = require('./src/models/csvModel');

let mainWindow;

// Função para criar a janela principal
function createMainWindow(data) {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 1200,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'src/views/index.html'));

    // Envia os dados para a janela principal após o carregamento da página
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('csv-data', data);
    });

    // Manipula o evento de recarregar o aplicativo
    function handleReload() {
        // Lê novamente os dados do arquivo CSV
        readCSV(path.join(__dirname, 'dados', 'arquivo.csv'), (newData) => {
            // Envia os novos dados para a janela principal
            mainWindow.webContents.send('csv-data', newData);
        });
    }

    ipcMain.on('reload-app', handleReload);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    return mainWindow;
}

function initializeApp() {
    // Lê os dados do arquivo CSV e cria a janela principal
    readCSV(path.join(__dirname, 'dados', 'arquivo.csv'), (data) => {
        createMainWindow(data);
    });

    // Ativa a janela principal se não houver janelas abertas
    app.on('activate', () => {
        if (!mainWindow) {
            createMainWindow();
        }
    });

    // Mantém a aplicação em execução mesmo quando todas as janelas são fechadas
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            // Não encerra a aplicação aqui para sistemas não macOS
        }
    });
}

app.whenReady().then(initializeApp);
