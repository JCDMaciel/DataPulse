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
            // Verifica se o erro é devido ao arquivo não existir
            if (err.code === 'ENOENT') {
                // Chama o callback com null para indicar que o arquivo não foi encontrado
                callback(null);
            } else {
                // Se for um erro diferente, imprime o erro
                console.error('Erro ao ler o arquivo CSV:', err);
            }
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

module.exports = {
    readCSV,
};
