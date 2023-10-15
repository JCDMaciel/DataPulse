const Chart = require('chart.js');

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    return `#${Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('')}`;
}

function renderChart(ctx, complexities, dataset, existingChart) {
    if (existingChart) {
        existingChart.destroy();
    }

    return new Chart(ctx, {
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
    renderChart,
};
