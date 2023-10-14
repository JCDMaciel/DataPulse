const Chart = require('chart.js');

let myChart;

function destroyExistingChart(chart) {
    if (chart) {
        chart.destroy();
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    return `#${Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('')}`;
}

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
