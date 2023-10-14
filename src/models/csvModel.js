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

function createDaysMap(data) {
    return data.reduce((daysMap, entry) => {
        const resolvedDate = new Date(entry['Resolved Date Log1']);
        const dayKey = resolvedDate.toISOString().split('T')[0];

        if (!daysMap.has(dayKey)) {
            daysMap.set(dayKey, 0);
        }

        daysMap.set(dayKey, daysMap.get(dayKey) + 1);

        return daysMap;
    }, new Map());
}

function calculateAverageItemsPerDay(totalItemsPerDay, totalDays) {
    return totalItemsPerDay.reduce((sum, count) => sum + count, 0) / totalDays;
}

module.exports = {
    readCSV,
    createDaysMap,
    calculateAverageItemsPerDay,
};
