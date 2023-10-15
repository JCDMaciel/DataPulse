const chartRenderer = require('./chartRenderer');

let myChart;

function createChart(canvasId, complexitiesObject) {
    const chartCanvas = document.getElementById(canvasId);
    const complexities = Object.keys(complexitiesObject);

    const ctx = chartCanvas.getContext('2d');
    const dataset = createChartDataset(complexities, complexitiesObject);

    // Destrói o gráfico existente antes de criar um novo
    if (myChart) {
        myChart.destroy();
    }

    updateTableAndChart(ctx, complexities, dataset);
}

function createChartDataset(complexities, complexitiesObject) {
    return {
        label: '',
        data: complexities.map(complexity => complexitiesObject[complexity]?.length || 0),
        backgroundColor: complexities.map(chartRenderer.getRandomColor),
    };
}

function updateTableAndChart(ctx, complexities, dataset) {
    myChart = chartRenderer.renderChart(ctx, complexities, dataset, myChart);
}

module.exports = {
    createChart,
};
