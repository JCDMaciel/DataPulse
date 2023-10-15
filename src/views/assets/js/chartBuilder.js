const chartRenderer = require('./chartRenderer');

/**
 * Cria o conjunto de dados para o gráfico de barras.
 * @param {string} canvasId - O ID do elemento canvas.
 * @param {Object} complexitiesObject - O objeto de complexidades a ser usado no conjunto de dados.
 */
function createChart(canvasId, complexitiesObject) {
    const chartCanvas = document.getElementById(canvasId);
    const complexities = Object.keys(complexitiesObject);

    const ctx = chartCanvas.getContext('2d');
    const dataset = createChartDataset(complexities, complexitiesObject);

    updateTableAndChart(ctx, complexities, dataset);
}

function createChartDataset(complexities, complexitiesObject) {
    return {
        label: '',
        data: complexities.map(complexity => complexitiesObject[complexity]?.length || 0),
        backgroundColor: complexities.map(chartRenderer.getRandomColor),
    };
}

/**
 * Atualiza o contêiner da tabela e o gráfico de barras.
 * @param {CanvasRenderingContext2D} ctx - O contexto do gráfico no qual desenhar.
 * @param {Array} complexities - Um array de rótulos para as complexidades.
 * @param {Object} dataset - O conjunto de dados para o gráfico.
 */
function updateTableAndChart(ctx, complexities, dataset) {
    chartRenderer.renderChart(ctx, complexities, dataset);
}

module.exports = {
    createChart,
};
