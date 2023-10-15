const { createTableElement, createTable} = require('../views/assets/js/tableBuilder');

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
    createTable(complexitiesObject);
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

/**
 * Cria um mapa contendo a contagem de itens por dia a partir dos dados fornecidos.
 * @param {Array} data - Dados do CSV parseados.
 * @returns {Map} - Mapa com a contagem de itens por dia.
 */
function createDaysMap(data) {
    return data.reduce((daysMap, entry) => {
        const resolvedDate = new Date(entry['Resolved Date Log1']);
        const dayKey = resolvedDate.toISOString().split('T')[0];

        updateDaysMap(daysMap, dayKey);

        return daysMap;
    }, new Map());
}

/**
 * Atualiza o mapa de dias com a contagem de itens.
 * @param {Map} daysMap - Mapa com a contagem de itens por dia.
 * @param {string} dayKey - Chave do dia.
 */
function updateDaysMap(daysMap, dayKey) {
    if (!daysMap.has(dayKey)) {
        daysMap.set(dayKey, 0);
    }

    daysMap.set(dayKey, daysMap.get(dayKey) + 1);
}

/**
 * Calcula a média de itens por dia.
 * @param {Array} totalItemsPerDay - Array contendo a contagem de itens por dia.
 * @param {number} totalDays - Número total de dias.
 * @returns {number} - Média de itens por dia.
 */
function calculateAverageItemsPerDay(totalItemsPerDay, totalDays) {
    return totalItemsPerDay.reduce((sum, count) => sum + count, 0) / totalDays;
}

/**
 * Recolhe o nome do usuario que está sendo analisado.
 * @param {Array} data - Dados do CSV parseados.
 * @returns {string} - Nome do usuário que está sendo analisado.
 */
function getUserName(data) {
    const assignedTo = data.map(item => {
        const fullName = item["Assigned To"];
        const endIndex = fullName.lastIndexOf(' ');

        return fullName.substring(0, endIndex);
    });

    return assignedTo[0];
}

module.exports = {
    groupByComplexity,
    countReprovados,
    mediaReprovados,
    createDaysMap,
    calculateAverageItemsPerDay,
    getUserName,
};
