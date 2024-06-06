let raportTypeInput, raportMonthInput, raportYearInput, raportBtn, raportMonthPanel, raportYearPanel, raportResult, raportAlert;







const prepareDomElements = () => {
    raportTypeInput = document.querySelector('#raport-panel-type')

    raportMonthPanel = document.querySelector('.raports__options--month')
    raportYearPanel = document.querySelector('.raports__options--year')
    raportMonthInput = document.querySelector('#raport-panel-month')
    raportYearInput = document.querySelector('#raport-panel-year')
    raportBtn = document.querySelector('.raports__btn--submit')
    raportResult = document.querySelector('.raports__result')
    raportAlert = document.querySelector('.raports__alert')
    

}


const prepareDomEvents = () => {

    raportBtn.addEventListener('click', (e) => {
        e.preventDefault()
        raportHandle()
    })


    raportTypeInput.addEventListener('change', raportTypeHandle);

}


const raportHandle = () => {
    // Sprawdzanie roku raportu
    const selectedYear = parseInt(raportYearInput.value, 10);
    const selectedType = raportTypeInput.value;
    const selectedMonth = raportMonthInput.value;

    raportAlert.innerText = '';
    raportAlert.style.color = '';

    if (selectedType === 'year' && (!selectedYear || selectedYear < 2000)) {
        raportAlert.innerText = "Rok nie może być mniejszy niż 2000";
        raportAlert.style.color = "red";
        return;
    }

    fetch('generate_pdf.php', {
        method: 'POST',
        body: new URLSearchParams({
            type: selectedType,
            month: selectedMonth,
            year: selectedYear
        })
    })
        .then(response => response.arrayBuffer())
        .then(data => {
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Raport_${selectedType === 'month' ? selectedMonth : selectedYear}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    raportResult.innerText = `Wybrany typ: ${raportTypeInput.value} ; wybrany miesiąc: ${selectedMonth} ; wybrany rok: ${selectedYear || 'nie dotyczy'}`;
}





//Wyswietlanie wyboru dat w zalezności od wyboru

const raportTypeHandle = () => {
    if (raportTypeInput.value === "month"){
        raportMonthPanel.style.display = "block"
        raportYearPanel.style.display = "none"
        raportYearInput.value = '';

    }else{
        raportYearPanel.style.display = "block"
        raportMonthPanel.style.display = "none"
        raportMonthInput.value = '';

    }
    
}



const main = () => {
    prepareDomElements();
    prepareDomEvents();
}



window.addEventListener('DOMContentLoaded', main);