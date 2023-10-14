const fs = require('fs').promises;
const parse = require('csv-parse');

/**
 * Lê um arquivo CSV e retorna uma Promise com os dados lidos.
 * @param {string} filePath - O caminho do arquivo CSV.
 * @returns {Promise<Array>} - Uma Promise que resolve com os dados lidos do CSV.
 */
async function readCSV(filePath) {
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const parsedData = await parseCSV(fileContent, { columns: true });
        return parsedData;
    } catch (error) {
        console.error('Erro ao ler ou fazer parse do arquivo CSV:', error);
        throw error;
    }
}

/**
 * Faz o parse de uma string CSV e retorna uma Promise com os dados.
 * @param {string} csvString - A string CSV.
 * @param {Object} options - Opções para o parser CSV.
 * @returns {Promise<Array>} - Uma Promise que resolve com os dados parseados do CSV.
 */
function parseCSV(csvString, options) {
    return new Promise((resolve, reject) => {
        parse(csvString, options, (err, data) => {
            if (err) {
                console.error('Erro ao fazer parse do CSV:', err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

/**
 * Cria um mapa de dias a partir dos dados CSV fornecidos.
 * @param {Array} data - O array de dados CSV.
 * @returns {Map} - Um mapa onde as chaves são datas e os valores são contagens de itens por dia.
 */
function createDaysMap(data) {
    return data.reduce((daysMap, entry) => {
        const resolvedDate = new Date(entry['Resolved Date Log1']);
        const dayKey = resolvedDate.toISOString().split('T')[0];

        daysMap.set(dayKey, (daysMap.get(dayKey) || 0) + 1);

        return daysMap;
    }, new Map());
}

/**
 * Calcula a média de itens por dia.
 * @param {Array} totalItemsPerDay - O array contendo o número de itens por dia.
 * @param {number} totalDays - O número total de dias.
 * @returns {number} - A média de itens por dia.
 */
function calculateAverageItemsPerDay(totalItemsPerDay, totalDays) {
    const sum = totalItemsPerDay.reduce((acc, count) => acc + count, 0);
    return sum / totalDays;
}

module.exports = {
    readCSV,
    createDaysMap,
    calculateAverageItemsPerDay,
};
