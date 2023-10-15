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

/**
 * Manipula os dados vindo do CSV e retorna o total de itens reprovados descartando as reprovações indevidas
 * @param {Array} data - O array de dados tratados do CSV
 * @returns {number} - total de itens reprovados
 */
function countReprovados(data) {
    const reprovados = data.filter(item => item['Tags'].includes('REPROVADO'));
    const reprovadosIndevidamente = data.filter(item => parseInt(item['Reprovação Indevida']) === 1);

    const reprovadosNaoIndevidamente = reprovados.filter(item => !reprovadosIndevidamente.includes(item));

    return reprovadosNaoIndevidamente.length;
}

/**
 * Retorna a media de itens reprovados
 * @param {number} totalItemsReprovadosNoMes - total de itens reprovados
 * @param {number} totalDays - total de dias de trabalho
 * @returns {number} - media de itens reprovados
 */
function mediaReprovados(totalItemsReprovadosNoMes, totalDays) {
    return totalItemsReprovadosNoMes / totalDays;
}

module.exports = {
    groupByComplexity,
    countReprovados,
    mediaReprovados
};
