const Chart = require('chart.js');

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
    const table = document.createElement('table');
    const headerRow = table.createTHead().insertRow(0);

    const headerCellComplexity = headerRow.insertCell(0);
    const headerCellCount = headerRow.insertCell(1);
    headerCellComplexity.textContent = 'Complexidade';
    headerCellCount.textContent = 'Quantidade de Itens';

    const complexities = Object.keys(complexitiesObject);
    complexities.forEach((complexity, index) => {
        const row = table.insertRow(index + 1);
        const cellComplexity = row.insertCell(0);
        const cellCount = row.insertCell(1);
        cellComplexity.textContent = complexity;
        cellCount.textContent = complexitiesObject[complexity].length;
    });

    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}

function groupByComplexity(data) {
    const complexitiesObject = initializeComplexities();
    fillComplexities(data, complexitiesObject);
    createTable(complexitiesObject);
    return complexitiesObject;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const { ipcRenderer } = require('electron');
ipcRenderer.on('csv-data', (event, data) => {
    renderChart('myChart', data);
});

function renderChart(canvasId, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    const groupedData = groupByComplexity(data);

    const complexities = ['undefined', '01 - Baixa', '02 - Média', '03 - Alta', '04 - Muito Alta'];

    const dataset = {
        label: 'Quantidade de Itens',
        data: complexities.map(complexity => groupedData[complexity]?.length || 0),
        backgroundColor: complexities.map(getRandomColor),
    };

    new Chart(ctx, {
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
