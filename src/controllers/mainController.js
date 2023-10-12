const csvModel = require('../models/csvModel');
const chartView = require('../views/chartView');

csvModel.readCSV('dados/arquivo.csv', (data) => {
    chartView.renderChart('meuGrafico', data);
});
