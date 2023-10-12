const fs = require('fs');
const parse = require('csv-parse');

function readCSV(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, fileContent) => {
        if (err) {
            console.error('Erro ao ler o arquivo CSV:', err);
            return;
        }

        parse(fileContent, {
            columns: true,
        }, (err, data) => {
            if (err) {
                console.error('Erro ao fazer parse do CSV:', err);
                return;
            }

            callback(data);
        });
    });
}

module.exports = {
    readCSV,
};
