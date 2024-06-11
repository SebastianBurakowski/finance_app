let statsInput, statsGenerateBtn, statsResult, barChart, lineChart, goalsChart;
let phoneNav, hamburger
let currentChart = null;

const prepareDomElements = () => {
    statsInput = document.querySelector('#stats-panel-type');
    statsGenerateBtn = document.querySelector('.stats__btn--submit');
    statsResult = document.querySelector('.stats_result');
    barChart = document.querySelector('#barChart');
    lineChart = document.querySelector('#lineChart');
    goalsChart = document.querySelector('#goalsChart');

    phoneNav = document.querySelector('.nav_phone')
    hamburger = document.querySelector('.fa-bars')
}


const showNav = () => {
    console.log("object");
    phoneNav.classList.toggle('show')

}
const chartHandle = () => {
    if (currentChart) {
        currentChart.destroy();
    }

    const type = statsInput.value;
    fetch(`get_chart_data.php?type=${type}`)
        .then(response => response.json())
        .then(data => {
            if (type === "monthlyExpenses" || type === "monthlyIncomes") {
                generateBarChart(data.labels, data.data, type === "monthlyExpenses" ? "Miesięczne Wydatki" : "Miesięczne Dochody");
            } else if (type === 'balance') {
                generateLineChart(data.labels, data.incomes, data.expenses, "Porównanie zarobków i wydatków");
            } else if (type === 'goals') {
                generateGoalsChart(data.labels, data.goals, "Cele Finansowe");
            }
        })
        .catch(error => console.error('Error:', error));
}

const generateBarChart = (labels, data, title) => {
    if (!barChart) return;

    barChart.style.display = 'block';
    if (lineChart) lineChart.style.display = 'none';
    if (goalsChart) goalsChart.style.display = 'none';

    const ctxBar = barChart.getContext('2d');
    currentChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

const generateLineChart = (labels, incomes, expenses, title) => {
    if (!lineChart) return;

    if (barChart) barChart.style.display = 'none';
    lineChart.style.display = 'block';
    if (goalsChart) goalsChart.style.display = 'none';

    const ctxLine = lineChart.getContext('2d');
    currentChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Zarobki',
                    data: incomes,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Wydatki',
                    data: expenses,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

const generateGoalsChart = (labels, goals, title) => {
    if (!goalsChart) return;

    if (barChart) barChart.style.display = 'none';
    if (lineChart) lineChart.style.display = 'none';
    goalsChart.style.display = 'block';

    const ctxGoals = goalsChart.getContext('2d');
    currentChart = new Chart(ctxGoals, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Kwota Całościowa',
                    data: goals.totalAmounts,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Kwota Wpłacona',
                    data: goals.paidAmounts,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

const prepareDomEvents = () => {
    hamburger.addEventListener('click', showNav)
    statsGenerateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        chartHandle();
    });
}

const main = () => {
    prepareDomElements();
    prepareDomEvents();
}

window.addEventListener('DOMContentLoaded', main);
