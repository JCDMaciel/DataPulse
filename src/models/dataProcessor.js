const { createTableElement } = require('../views/assets/js/tableBuilder');

/**
 * Inicializa um objeto de complexidades com arrays vazios.
 * @returns {Object} - Um objeto onde as chaves são os níveis de complexidade e os valores são arrays vazios.
 */
function initializeComplexities() {
    const complexityLevels = ['undefined', '01 - Baixa', '02 - Média', '03 - Alta', '04 - Muito Alta'];
    return complexityLevels.reduce((acc, complexity) => {
        acc[complexity] = [];
        return acc;
    }, {});
}

/**
 * Preenche o objeto de complexidades com dados do array fornecido.
 * @param {Array} data - O array de dados a serem processados.
 * @param {Object} complexitiesObject - O objeto de complexidades a ser preenchido.
 */
function fillComplexities(data, complexitiesObject) {
    data.forEach(entry => {
        const complexity = entry['Complexidade Dev'] || 'undefined';
        complexitiesObject[complexity].push(entry);
    });
}

/**
 * Cria uma tabela com base no objeto de complexidades fornecido.
 * @param {Object} complexitiesObject - O objeto de complexidades a ser usado na criação da tabela.
 */
function createComplexitiesTable(complexitiesObject) {
    createTableElement(complexitiesObject);
}

/**
 * Agrupa os dados por complexidade, preenche um objeto de complexidades e cria uma tabela.
 * @param {Array} data - O array de dados a serem agrupados.
 * @returns {Object} - O objeto de complexidades resultante.
 */
function groupByComplexity(data) {
    const complexitiesObject = initializeComplexities();
    fillComplexities(data, complexitiesObject);
    createComplexitiesTable(complexitiesObject);
    return complexitiesObject;
}

module.exports = {
    groupByComplexity,
};
