const Chart = require('chart.js');
const { ipcRenderer, shell } = require('electron');
const path = require('path');

let myChart;

function initializeComplexities() {
    return ['undefined', '01 - Baixa', '02 - Média', '03 - Alta', '04 - Muito Alta']
        .reduce((acc, complexity) => {
            acc[complexity] = [];
            return acc;
        }, {});
}

function fillComplexities(data, complexitiesObject) {
    data.forEach(entry => {
        const complexity = entry['Complexidade Dev'] || 'undefined';
        complexitiesObject[complexity].push(entry);
    });
}

function createTable(complexitiesObject) {
    const tableContainer = document.getElementById('table-container');
    const table = createTableElement(complexitiesObject);
    updateTableContainer(tableContainer, table);
}

function createTableElement(complexitiesObject) {
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered');

    createTableHeader(table);
    createTableBody(table, complexitiesObject);

    return table;
}

function createTableHeader(table) {
    const thead = table.createTHead();
    thead.classList.add('table-dark');

    const headerRow = thead.insertRow(0);
    createHeaderCell(headerRow, 'Complexidade');
    createHeaderCell(headerRow, 'Itens por complexidade');
}

function createTableBody(table, complexitiesObject) {
    const complexities = Object.keys(complexitiesObject);
    complexities.forEach((complexity, index) => {
        const row = table.insertRow(index + 1);
        createCell(row, complexity);
        createCell(row, complexitiesObject[complexity].length);
    });
}

function createHeaderCell(row, text) {
    const cell = row.insertCell();
    cell.textContent = text;
}

function createCell(row, value) {
    const cell = row.insertCell();
    cell.textContent = value;
}

function updateTableContainer(container, table) {
    container.innerHTML = '';
    container.appendChild(table);
}

function groupByComplexity(data) {
    const complexitiesObject = initializeComplexities();
    fillComplexities(data, complexitiesObject);
    createTable(complexitiesObject);
    return complexitiesObject;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    return `#${Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('')}`;
}

ipcRenderer.on('csv-data', (event, data) => {
    groupByComplexity(data);
    calculateTotalItemsAndAverage(data);
    renderChart('myChart', data);
});

function renderChart(canvasId, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    destroyExistingChart();

    const groupedData = groupByComplexity(data);
    const complexities = ['undefined', '01 - Baixa', '02 - Média', '03 - Alta', '04 - Muito Alta'];

    const dataset = {
        label: 'Quantidade de Itens',
        data: complexities.map(complexity => groupedData[complexity]?.length || 0),
        backgroundColor: complexities.map(getRandomColor),
    };

    createNewChart(ctx, complexities, dataset);
}

function destroyExistingChart() {
    if (myChart) {
        myChart.destroy();
    }
}

function createNewChart(ctx, complexities, dataset) {
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: complexities,
            datasets: [dataset],
        },
        options: {
            legend: {
                display: false,
            },
        },
    });
}

function calculateTotalItemsAndAverage(data) {
    const totalItensNoMes = data.length;
    const daysMap = createDaysMap(data);

    const totalDays = daysMap.size;
    const totalItemsPerDay = Array.from(daysMap.values());
    const averageItemsPerDay = calculateAverageItemsPerDay(totalItemsPerDay, totalDays);

    updateUI(totalItensNoMes, averageItemsPerDay);
}

function createDaysMap(data) {
    return data.reduce((daysMap, entry) => {
        const resolvedDate = new Date(entry['Resolved Date Log1']);
        const dayKey = resolvedDate.toISOString().split('T')[0];

        if (!daysMap.has(dayKey)) {
            daysMap.set(dayKey, 0);
        }

        daysMap.set(dayKey, daysMap.get(dayKey) + 1);

        return daysMap;
    }, new Map());
}

function calculateAverageItemsPerDay(totalItemsPerDay, totalDays) {
    return totalItemsPerDay.reduce((sum, count) => sum + count, 0) / totalDays;
}

function updateUI(totalItensNoMes, averageItemsPerDay) {
    document.getElementById('totalItensNoMes').textContent = totalItensNoMes.toString();
    document.getElementById('mediaItensPorDia').textContent = averageItemsPerDay.toFixed(2);
}

function abrirLinkExterno() {
    const url = 'https://grupoitss.visualstudio.com/DocNix%20Corporate/_queries/query/?tempQueryId=f76e0957-bfbb-4f82-aeb2-bfee85b4d37b';
    shell.openExternal(url);
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
            await uploadCsvFile(file);
        } else {
            alert('Por favor, selecione um arquivo CSV.');
        }
    }
}

async function uploadCsvFile(file) {
    const uploadDir = path.join(__dirname, '..', '..', 'dados');
    const uploadPath = path.join(uploadDir, 'arquivo.csv');

    try {
        await createDirectory(uploadDir);
        await deleteExistingFile(uploadPath);
        await copyFile(file.path, uploadPath);
        handleReload();
    } catch (err) {
        console.error(err);
    }
}

async function createDirectory(directoryPath) {
    const fs = require('fs').promises;
    await fs.mkdir(directoryPath, { recursive: true });
}

async function deleteExistingFile(filePath) {
    const fs = require('fs').promises;
    await fs.unlink(filePath).catch(() => {});
}

async function copyFile(sourcePath, destinationPath) {
    const fs = require('fs').promises;
    const fsOriginal = require('fs');
    const readStream = fsOriginal.createReadStream(sourcePath);
    const writeStream = fsOriginal.createWriteStream(destinationPath);

    await new Promise((resolve, reject) => {
        readStream.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
}
