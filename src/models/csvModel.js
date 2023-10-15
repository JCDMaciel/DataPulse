const fs = require('fs');
const parse = require('csv-parse');

/**
 * Lê o conteúdo de um arquivo CSV e chama a função de retorno com os dados parseados.
 * @param {string} filePath - Caminho para o arquivo CSV.
 * @param {function} callback - Função de retorno que recebe os dados parseados como argumento.
 */
function readCSV(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, fileContent) => {
        if (err) {
            console.error('Erro ao ler o arquivo CSV:', err);
            return;
        }

        parseCSV(fileContent, callback);
    });
}

/**
 * Faz o parse do conteúdo CSV e chama a função de retorno com os dados parseados.
 * @param {string} csvContent - Conteúdo CSV a ser parseado.
 * @param {function} callback - Função de retorno que recebe os dados parseados como argumento.
 */
function parseCSV(csvContent, callback) {
    parse(csvContent, { columns: true }, (err, data) => {
        if (err) {
            console.error('Erro ao fazer parse do CSV:', err);
            return;
        }

        callback(data);
    });
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

function getUserName(data) {
    const assignedTo = data.map(item => {
        const fullName = item["Assigned To"];
        const endIndex = fullName.lastIndexOf(' ');

        return fullName.substring(0, endIndex);
    });

    console.log(assignedTo[0]);

    return assignedTo[0];
}

module.exports = {
    readCSV,
    createDaysMap,
    calculateAverageItemsPerDay,
    getUserName,
};
