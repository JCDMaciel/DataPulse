const chartRenderer = require('./chartRenderer');

function createTableAndChart(canvasId, complexitiesObject) {
    const tableContainer = document.getElementById('table-container');
    const chartCanvas = document.getElementById(canvasId);
    const complexities = Object.keys(complexitiesObject);

    const table = createTableElement(complexitiesObject);
    const ctx = chartCanvas.getContext('2d');
    const dataset = {
        label: 'Quantidade de Itens',
        data: complexities.map(complexity => complexitiesObject[complexity]?.length || 0),
        backgroundColor: complexities.map(chartRenderer.getRandomColor),
    };

    updateTableContainer(tableContainer, table);
    chartRenderer.destroyExistingChart();
    chartRenderer.renderChart(ctx, complexities, dataset);
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

module.exports = {
    createTableAndChart,
    createTableElement,
    updateTableContainer,
};
