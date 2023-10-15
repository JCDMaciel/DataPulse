/**
 * Cria um elemento de tabela.
 * @param {Object} complexitiesObject - O objeto de complexidades a ser usado na tabela.
 * @returns {HTMLTableElement} - O elemento de tabela criado.
 */
function createTable(complexitiesObject) {
    const tableContainer = document.getElementById('table-container');
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered');

    createTableHeader(table);
    createTableBody(table, complexitiesObject);

    updateTableContainer(tableContainer, table);
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
    createTable,
};
