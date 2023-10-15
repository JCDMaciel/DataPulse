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
            nodeIntegration: true, // Permite a integração com APIs Node.js no processo de renderização
            contextIsolation: false, // Desabilita a isolamento de contexto para simplificar o acesso a APIs Node.js
        },
    });

    // Carrega o arquivo HTML na janela principal
    mainWindow.loadFile(path.join(__dirname, 'src/views/index.html'));

    // Envia os dados para a janela principal após o carregamento da página
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('csv-data', data);
    });

    // Manipula o evento de recarregar o aplicativo
    function handleReload() {
        const currentWindow = BrowserWindow.getFocusedWindow();

        // Fecha a janela atual se existir
        if (currentWindow) {
            currentWindow.close();

            // Adiciona um pequeno atraso antes de criar uma nova janela
            setTimeout(() => {
                // Remove todos os ouvintes do evento 'reload-app' antes de adicionar um novo
                ipcMain.removeAllListeners('reload-app');

                // Cria uma nova janela principal com os dados
                createMainWindow(data);
            }, 300); // Ajuste este valor conforme necessário
        }
    }

    ipcMain.on('reload-app', handleReload); // Registra o manipulador para o evento 'reload-app'

    // Manipula o evento de fechar a janela
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    return mainWindow;
}

app.whenReady().then(() => {
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
});
