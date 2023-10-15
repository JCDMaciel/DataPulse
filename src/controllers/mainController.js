const { ipcRenderer, shell } = require('electron');
const dataProcessor = require('../models/dataProcessor');
const tableBuilder = require('../views/assets/js/tableBuilder');
const chartBuilder = require('../views/assets/js/chartBuilder');
const uiUpdater = require('../views/assets/js/uiUpdater');
const fileHandler = require('../models/fileHandler');

// Assinatura do evento 'csv-data' enviado do processo principal
ipcRenderer.on('csv-data', handleCSVData);

/**
 * Manipula os dados CSV recebidos do evento 'csv-data'.
 * @param {Event} event - Evento contendo os dados CSV.
 * @param {Array} data - Dados do CSV.
 */
function handleCSVData(event, data) {
    // Agrupa os dados por complexidade e cria a tabela e o gráfico
    const complexitiesObject = dataProcessor.groupByComplexity(data);
    tableBuilder.createTable(complexitiesObject);
    chartBuilder.createChart('myChart', complexitiesObject);

    initializeApp(data);
}

/**
 * inicializa os dados e atualiza a interface do usuário.
 * @param {Array} data - Dados do CSV.
 */
function initializeApp(data) {
    const totalItemsNoMes = data.length;

    // Cria um mapa contendo a contagem de itens por dia
    const daysMap = dataProcessor.createDaysMap(data);

    const totalDays = daysMap.size;
    const totalItemsPerDay = Array.from(daysMap.values());
    const averageItemsPerDay = dataProcessor.calculateAverageItemsPerDay(totalItemsPerDay, totalDays);
    const userName = dataProcessor.getUserName(data);
    const totalItemsReprovadosNoMes = dataProcessor.countReprovados(data);
    const mediaItensReprovadosNoMes = dataProcessor.mediaReprovados(totalItemsReprovadosNoMes, totalDays);

    // Atualiza a interface do usuário com os resultados
    uiUpdater.updateUI(totalItemsNoMes, averageItemsPerDay, userName, totalItemsReprovadosNoMes, mediaItensReprovadosNoMes);
}

/**
 * Manipula o evento de recarregar a aplicação.
 */
function handleReload() {
    ipcRenderer.send('reload-app');
}

// Aguarda o DOM ser totalmente carregado para adicionar o evento de clique ao botão de upload
document.addEventListener('DOMContentLoaded', setupEventListeners);

/**
 * Configura os Escutadores de eventos após o carregamento do DOM.
 */
function setupEventListeners() {
    const uploadButton = document.getElementById('uploadButton');
    uploadButton.addEventListener('click', handleUploadButtonClick);
}

/**
 * Manipula o clique no botão de upload, abrindo o seletor de arquivos.
 */
function handleUploadButtonClick() {
    document.getElementById('fileInput').click();
}

/**
 * Manipula o upload de arquivo, verificando se é um arquivo CSV antes de prosseguir.
 */
async function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        if (file.name.endsWith('.csv')) {
            // Realiza o upload do arquivo CSV
            await fileHandler.uploadCsvFile(file);
        } else {
            alert('Por favor, selecione um arquivo CSV.');
        }
    }
}
