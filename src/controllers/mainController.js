const { ipcRenderer, shell } = require('electron');
const csvModel = require('../models/csvModel');
const dataProcessor = require('../models/dataProcessor');
const tableBuilder = require('../views/tableBuilder');
const uiUpdater = require('../views/uiUpdater');
const fileHandler = require('../models/fileHandler');

ipcRenderer.on('csv-data', (event, data) => {
    const complexitiesObject = dataProcessor.groupByComplexity(data);
    tableBuilder.createTableAndChart('myChart', complexitiesObject);
    calculateTotalItemsAndAverage(data);
});

function calculateTotalItemsAndAverage(data) {
    const totalItensNoMes = data.length;
    const daysMap = csvModel.createDaysMap(data);

    const totalDays = daysMap.size;
    const totalItemsPerDay = Array.from(daysMap.values());
    const averageItemsPerDay = csvModel.calculateAverageItemsPerDay(totalItemsPerDay, totalDays);

    uiUpdater.updateUI(totalItensNoMes, averageItemsPerDay);
}

function handleReload() {
    ipcRenderer.send('reload-app');
}

document.addEventListener('DOMContentLoaded', function () {
    const uploadButton = document.getElementById('uploadButton');
    uploadButton.addEventListener('click', handleUploadButtonClick);
});

function handleUploadButtonClick() {
    document.getElementById('fileInput').click();
}

async function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        if (file.name.endsWith('.csv')) {
            await fileHandler.uploadCsvFile(file);
        } else {
            alert('Por favor, selecione um arquivo CSV.');
        }
    }
}
