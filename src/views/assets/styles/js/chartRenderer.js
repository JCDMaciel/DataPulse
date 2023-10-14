const Chart = require('chart.js');

let myChart;

/**
 * Destrói o gráfico existente se houver.
 * @param {Chart} chart - O objeto de gráfico a ser destruído.
 */
function destroyExistingChart(chart) {
    if (chart) {
        chart.destroy();
    }
}

/**
 * Gera uma cor aleatória hexadecimal.
 * @returns {string} - Uma cor aleatória no formato hexadecimal.
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    return `#${Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('')}`;
}

/**
 * Renderiza um gráfico de barras.
 * @param {CanvasRenderingContext2D} ctx - O contexto do gráfico no qual desenhar.
 * @param {Array} complexities - Um array de rótulos para as complexidades.
 * @param {Object} dataset - O conjunto de dados para o gráfico.
 */
function renderChart(ctx, complexities, dataset) {
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: complexities,
            datasets: [dataset],
        },
        options: {
            legend: {
                display: false,
            },
        },
    });
}

module.exports = {
    getRandomColor,
    destroyExistingChart,
    renderChart,
};
