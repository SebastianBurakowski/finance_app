let incomeInput, monthlyExpensesInput, monthlyLiabilitiesInput, dependentsInput, periodInput, latePaymentsInput, submitBtn, resultSpan, creditInfoText;

const prepareDomElements = () => {
    incomeInput = document.querySelector('#credit-panel-income');
    monthlyExpensesInput = document.querySelector('#credit-panel-expenses');
    monthlyLiabilitiesInput = document.querySelector('#credit-panel-liabilities');
    dependentsInput = document.querySelector('#credit-panel-dependents');
    periodInput = document.querySelector('#credit-panel-period');
    latePaymentsInput = document.querySelector('#credit-panel-late');
    submitBtn = document.querySelector('.credit__btn--submit');
    resultSpan = document.querySelector('.credit__result');
    creditInfoText = document.querySelector('.credit__info')
}

const calculateHandle = (incomeInput, monthlyExpensesInput, monthlyLiabilitiesInput, dependentsInput, periodInput, latePaymentsInput, creditInfoText) => {
    const income = parseFloat(incomeInput.value);
    const expenses = parseFloat(monthlyExpensesInput.value);
    const liabilities = parseFloat(monthlyLiabilitiesInput.value);
    const dependents = parseFloat(dependentsInput.value);
    const period = parseFloat(periodInput.value);
    const latePayment = latePaymentsInput.value;


    if (!incomeInput.value || !monthlyExpensesInput.value || !monthlyLiabilitiesInput.value || !dependentsInput.value || !periodInput.value || latePaymentsInput.value === 'none') {
        creditInfoText.innerText = "Wprowadź poprawne dane we wszystkich polach.";
        creditInfoText.style.color = 'red'
        
    } else if (expenses > income) {
        creditInfoText.innerText = "Wydatki przekraczają zarobki"
        creditInfoText.style.color = 'red'
    } else {
        // Suma Wszystkich Wydatków
        const totalExpenses = expenses + liabilities;

        // Wolne środki 
        const freeMoney = income - totalExpenses;

        // Korekta opóźnienia w spłatach
        const latePaymentAdjustment = latePayment === 'yes' ? 0.8 : 1;

        // Maksymalna rata 
        const maxMonthlyLoan = freeMoney * latePaymentAdjustment * 0.65;

        // Maksymalna Kwota
        const maxLoan = maxMonthlyLoan * period;

        return maxLoan;

    }


    



}


const clearInputs = () => {
    incomeInput.value = ''
    monthlyExpensesInput.value = ''
    monthlyLiabilitiesInput.value = ''
    dependentsInput.value = ''
    periodInput.value = ''
    latePaymentsInput.value = ''
}

const prepareDomEvents = () => {
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const result = calculateHandle(incomeInput, monthlyExpensesInput, monthlyLiabilitiesInput, dependentsInput, periodInput, latePaymentsInput, creditInfoText);
        if (result < 0) {
            creditInfoText.innerText = "Błedne dane"
            return;
     
        } else {
            creditInfoText.innerHTML = `<p class="credit__info"> Twoja zdolność kredytowa wynosi : <span class="credit__result">${result.toFixed(2)}</span> zł</p>`
            creditInfoText.style.color = 'white'
        }


        clearInputs()
      
    });
}

const main = () => {
    prepareDomElements();
    prepareDomEvents();
}

window.addEventListener('DOMContentLoaded', main);
