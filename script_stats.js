let statsInput, statsGenerateBtn, statsResult, barChart, lineChart, pieChart

let data = [1200, 1500, 1800, 1300, 1600, 2000, 1700, 1800, 19000, 2100, 2300, 2400];
let labels = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']
let chartTitle = ''

let currentChart = null;









const prepareDomElements = () => {
    statsInput = document.querySelector('#stats-panel-type')
    statsGenerateBtn = document.querySelector('.stats__btn--submit')
    statsResult = document.querySelector('.stats_result')
    barChart = document.querySelector('#barChart')
    lineChart = document.querySelector('#lineChart')
    pieChart = document.querySelector('#pieChart')


}


const chartHandle = () => {

    //usuwanie Wykresu z pamięci

    if (currentChart) {
        currentChart.destroy();
    }


    if (statsInput.value === "monthlyExpenses") {

        chartTitle = "Miesięczne Wydatki"

        pieChart.style.display = 'none'
        lineChart.style.display = 'none'
        barChart.style.display = 'block'

        const ctxBar = document.getElementById('barChart').getContext('2d');
        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: chartTitle,
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(255, 206, 86, 0.3)',
                        'rgba(75, 192, 192, 0.3)',
                        'rgba(153, 102, 255, 0.3)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
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

    } else if (statsInput.value === 'monhlyIncomes') {

        chartTitle = "Miesięczne Dochody"

        barChart.style.display = 'none'
        pieChart.style.display = 'none'
        lineChart.style.display = 'block'

        const ctxLine = document.getElementById('lineChart').getContext('2d');
        new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: chartTitle,
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
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


    } else {

        chartTitle = "Wykres kołowy"

        barChart.style.display = 'none'
        lineChart.style.display = 'none'
        pieChart.style.display = 'block'

        const ctxPie = document.getElementById('pieChart').getContext('2d');
        new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: chartTitle,
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true
            }
        });

    }

}




const prepareDomEvents = () => {
    statsGenerateBtn.addEventListener('click', (e) => {
        e.preventDefault()
        chartHandle();
    })



}







const main = () => {
    prepareDomElements();
    prepareDomEvents();
}



window.addEventListener('DOMContentLoaded', main);
