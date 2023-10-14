const { ipcRenderer } = require('electron');
const csvModel = require('../models/csvModel');
const dataProcessor = require('../models/dataProcessor');
const tableBuilder = require('../views/assets/styles/js/tableBuilder');
const uiUpdater = require('../views/assets/styles/js/uiUpdater');
const fileHandler = require('../models/fileHandler');

// Constantes
const RELOAD_APP_EVENT = 'reload-app';

/**
 * Manipula o evento 'csv-data', acionado quando os dados CSV são recebidos.
 * @param {Evento} event - O objeto de evento.
 * @param {Array} data - O array de dados CSV.
 */
function handleCsvData(event, data) {
    // Processa os dados CSV e atualiza a interface do usuário
    const complexitiesObject = dataProcessor.groupByComplexity(data);
    tableBuilder.createTableAndChart('myChart', complexitiesObject);
    calcularTotalItensEMedia(data);
}

/**
 * Calcula o total de itens e a média de itens por dia e atualiza a interface do usuário.
 * @param {Array} data - O array de dados CSV.
 */
function calcularTotalItensEMedia(data) {
    // Calcula o total de itens, total de dias e média de itens por dia
    const totalItensNoMes = data.length;
    const daysMap = csvModel.createDaysMap(data);
    const totalDias = daysMap.size;
    const totalItensPorDia = Array.from(daysMap.values());
    const mediaItensPorDia = csvModel.calculateAverageItemsPerDay(totalItensPorDia, totalDias);

    // Atualiza a interface do usuário com os valores calculados
    uiUpdater.updateUI(totalItensNoMes, mediaItensPorDia);
}

/**
 * Manipula o clique no botão 'reload'.
 */
function handleReload() {
    ipcRenderer.send(RELOAD_APP_EVENT);
}

// Ouvinte de eventos para o evento DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // Configura o ouvinte de eventos para o botão 'reload'
    const uploadButton = document.getElementById('uploadButton');
    uploadButton.addEventListener('click', handleUploadButtonClick);
});

/**
 * Manipula o clique no botão de upload de arquivo.
 */
function handleUploadButtonClick() {
    document.getElementById('fileInput').click();
}

// Ouvinte de eventos para o evento de mudança do input de arquivo
document.getElementById('fileInput').addEventListener('change', handleFileUpload);

/**
 * Manipula o evento de upload de arquivo.
 */
async function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        if (file.name.endsWith('.csv')) {
            // Realiza o upload do arquivo CSV e o processa
            await fileHandler.uploadCsvFile(file);
        } else {
            // Exibe um alerta se o arquivo selecionado não for um CSV
            alert('Por favor, selecione um arquivo CSV.');
        }
    }
}
