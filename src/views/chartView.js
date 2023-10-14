const Chart = require('chart.js');
const { ipcRenderer, shell} = require('electron');

let myChart;

function initializeComplexities() {
    const complexities = ['undefined', '01 - Baixa', '02 - Média', '03 - Alta', '04 - Muito Alta'];
    return complexities.reduce((acc, complexity) => {
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
    const headerCellComplexity = headerRow.insertCell(0);
    const headerCellCount = headerRow.insertCell(1);

    headerCellComplexity.textContent = 'Complexidade';
    headerCellCount.textContent = 'Itens por complexidade';
}

function createTableBody(table, complexitiesObject) {
    const complexities = Object.keys(complexitiesObject);
    complexities.forEach((complexity, index) => {
        const row = table.insertRow(index + 1);
        const cellComplexity = row.insertCell(0);
        const cellCount = row.insertCell(1);
        cellComplexity.textContent = complexity;
        cellCount.textContent = complexitiesObject[complexity].length;
    });
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
    const daysMap = new Map();
    data.forEach(entry => {
        const resolvedDate = new Date(entry['Resolved Date Log1']);
        const dayKey = resolvedDate.toISOString().split('T')[0];

        if (!daysMap.has(dayKey)) {
            daysMap.set(dayKey, 0);
        }

        daysMap.set(dayKey, daysMap.get(dayKey) + 1);
    });

    return daysMap;
}

function calculateAverageItemsPerDay(totalItemsPerDay, totalDays) {
    return totalItemsPerDay.reduce((sum, count) => sum + count, 0) / totalDays;
}

function updateUI(totalItensNoMes, averageItemsPerDay) {
    document.getElementById('totalItensNoMes').textContent = totalItensNoMes.toString();
    document.getElementById('mediaItensPorDia').textContent = averageItemsPerDay.toFixed(2);
}

function abrirLinkExterno() {
    url = 'https://grupoitss.visualstudio.com/DocNix%20Corporate/_queries/query/?tempQueryId=f76e0957-bfbb-4f82-aeb2-bfee85b4d37b';
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

// Adicione esta função no seu chartView.js
async function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        if (file.name.endsWith('.csv')) {
            const fs = require('fs').promises;
            const path = require('path');
            const uploadDir = path.join(__dirname, '..', '..', 'dados');
            const uploadPath = path.join(uploadDir, 'arquivo.csv');

            try {
                // Verifique se a pasta 'dados' existe, crie se não existir
                await fs.mkdir(uploadDir, { recursive: true });

                // Verifique se há um arquivo 'arquivo.csv' e exclua se existir
                const existingFile = path.join(uploadDir, 'arquivo.csv');
                await fs.unlink(existingFile).catch(() => {}); // Ignora se não existir

                // Use fs.promises.rename para renomear e mover o arquivo
                await fs.rename(file.path, uploadPath);

                // Operação de cópia concluída com sucesso
                // Aqui você pode adicionar lógica adicional se necessário

                // Recarregue a página ou faça qualquer ação necessária
                handleReload();
            } catch (err) {
                console.error(err);
            }
        } else {
            alert('Por favor, selecione um arquivo CSV.');
        }
    }
}

