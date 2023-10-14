const chartRenderer = require('./chartRenderer');

/**
 * Cria uma tabela e um gráfico de barras.
 * @param {string} canvasId - O ID do elemento de canvas do gráfico.
 * @param {Object} complexitiesObject - O objeto de complexidades a ser usado na tabela e no gráfico.
 */
function createTableAndChart(canvasId, complexitiesObject) {
    const tableContainer = document.getElementById('table-container');
    const chartCanvas = document.getElementById(canvasId);
    const complexities = Object.keys(complexitiesObject);

    const table = createTableElement(complexitiesObject);
    const ctx = chartCanvas.getContext('2d');
    const dataset = createChartDataset(complexities, complexitiesObject);

    updateTableAndChart(tableContainer, table, ctx, complexities, dataset);
}

/**
 * Cria um elemento de tabela.
 * @param {Object} complexitiesObject - O objeto de complexidades a ser usado na tabela.
 * @returns {HTMLTableElement} - O elemento de tabela criado.
 */
function createTableElement(complexitiesObject) {
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered');

    createTableHeader(table);
    createTableBody(table, complexitiesObject);

    return table;
}

/**
 * Cria o conjunto de dados para o gráfico de barras.
 * @param {Array} complexities - Um array de rótulos para as complexidades.
 * @param {Object} complexitiesObject - O objeto de complexidades a ser usado no conjunto de dados.
 * @returns {Object} - O conjunto de dados para o gráfico.
 */
function createChartDataset(complexities, complexitiesObject) {
    return {
        label: '',
        data: complexities.map(complexity => complexitiesObject[complexity]?.length || 0),
        backgroundColor: complexities.map(chartRenderer.getRandomColor),
    };
}

/**
 * Atualiza o contêiner da tabela e o gráfico de barras.
 * @param {HTMLElement} container - O contêiner da tabela.
 * @param {HTMLTableElement} table - O elemento de tabela.
 * @param {CanvasRenderingContext2D} ctx - O contexto do gráfico no qual desenhar.
 * @param {Array} complexities - Um array de rótulos para as complexidades.
 * @param {Object} dataset - O conjunto de dados para o gráfico.
 */
function updateTableAndChart(container, table, ctx, complexities, dataset) {
    updateTableContainer(container, table);
    chartRenderer.destroyExistingChart(chartRenderer.myChart);
    chartRenderer.renderChart(ctx, complexities, dataset);
}

/**
 * Cria a linha de cabeçalho da tabela.
 * @param {HTMLTableElement} table - O elemento de tabela.
 */
function createTableHeader(table) {
    const thead = table.createTHead();
    thead.classList.add('table-dark');

    const headerRow = thead.insertRow(0);
    createHeaderCell(headerRow, 'Complexidade');
    createHeaderCell(headerRow, 'Itens por complexidade');
}

/**
 * Cria o corpo da tabela com base no objeto de complexidades.
 * @param {HTMLTableElement} table - O elemento de tabela.
 * @param {Object} complexitiesObject - O objeto de complexidades a ser usado na tabela.
 */
function createTableBody(table, complexitiesObject) {
    const complexities = Object.keys(complexitiesObject);
    complexities.forEach((complexity, index) => {
        const row = table.insertRow(index + 1);
        createCell(row, complexity);
        createCell(row, complexitiesObject[complexity].length);
    });
}

/**
 * Cria uma célula de cabeçalho na linha.
 * @param {HTMLTableRowElement} row - A linha da tabela.
 * @param {string} text - O texto para a célula de cabeçalho.
 */
function createHeaderCell(row, text) {
    const cell = row.insertCell();
    cell.textContent = text;
}

/**
 * Cria uma célula na linha com um valor.
 * @param {HTMLTableRowElement} row - A linha da tabela.
 * @param {string|number} value - O valor para a célula.
 */
function createCell(row, value) {
    const cell = row.insertCell();
    cell.textContent = value;
}

/**
 * Atualiza o contêiner da tabela.
 * @param {HTMLElement} container - O contêiner da tabela.
 * @param {HTMLTableElement} table - O elemento de tabela.
 */
function updateTableContainer(container, table) {
    container.innerHTML = '';
    container.appendChild(table);
}

module.exports = {
    createTableAndChart,
    createTableElement,
    updateTableContainer,
};
