const {createTableElement} = require("../views/tableBuilder");

function initializeComplexities() {
    return ['undefined', '01 - Baixa', '02 - Média', '03 - Alta', '04 - Muito Alta']
        .reduce((acc, complexity) => {
            acc[complexity] = [];
            return acc;
        }, {});
}

function fillComplexities(data, complexitiesObject) {
    data.forEach(entry => {
        const complexity = entry['Complexidade Dev'] || 'undefined';
        complexitiesObject[complexity].push(entry);
    });
}

function groupByComplexity(data) {
    const complexitiesObject = initializeComplexities();
    fillComplexities(data, complexitiesObject);
    createTableElement(complexitiesObject);
    return complexitiesObject;
}

module.exports = {
    groupByComplexity,
};
