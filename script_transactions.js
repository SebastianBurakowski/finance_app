//Głowna strona przyciski
let openTransactionBtn, openGoalBtn, openBudgetBtn, deleteAllBtn;
let availableMoney, transactionSearchInputIncome, transactionSearchInputExpense, transactionsIncomeArr, transactionsExpenseArr



//Panel dodawania transakcjji
let addTransactionPanel, addNameInput, addAmountInput, addCategoryInput, addDateInput
let ID, category, categoryPicked, totalMoney
let addPanelBtn, addPanelCategoryBtn, addPanelCancelBtn
let addPanelCategoryParagraph, incomeTransactions, expenseTransactions
let currentGoal



//Panel celów finansowych
let addGoalPanel, goalPanelCancelBtn, goalNameInput, goalAmountInput, goalDateInput, goalList;
//Dodawnie nowego celu
let addToGoalBtn, removeGoalBtn, goalAlert
//Okno dodawnia celu
let depositAmountInput, depositAddBtn, depositCloseBtn, depositAlert


//Panel Finansów i budżetu
let financePanel, budgetNameInput, budgetAmountInput, feeNameInput, feeAmountInput, financeCloseBtn;








const prepareDomElements = () => {

    //////// POBIERANIE ELEMENTÓW STRONY //////




    //przyciski głownej strony
    openTransactionBtn = document.querySelector('.options__btn--add')
    openGoalBtn = document.querySelector('.options__btn--goal')
    openBudgetBtn = document.querySelector('.options__btn--fee')

    deleteAllBtn = document.querySelector('.options__btn--delete')




    //Panel dodawania transakcji
    addTransactionPanel = document.querySelector('.add-panel')
    addNameInput = document.querySelector('#add-panel-name')
    addAmountInput = document.querySelector('#add-panel-amount')
    addCategoryInput = document.querySelector('#add-panel-category')
    addDateInput = document.querySelector('#add-panel-date')
    addAlertText = document.querySelector('.transaction__alert')


    addPanelBtn = document.querySelector('.add-panel__btn--add')
    addPanelCategoryBtn = document.querySelector('.add-panel__btn--category')
    addPanelCancelBtn = document.querySelector('.add-panel__btn--cancel')
    addPanelCategoryParagraph = document.querySelector('.transaction__name--category')

    incomeTransactions = document.querySelector('.transactions__income')
    expenseTransactions = document.querySelector('.transactions__expenses')




    //--------------------------Panel celów finansowych----------------------------//
    //
    addGoalPanel = document.querySelector('.goals__panel')
    goalPanelCancelBtn = document.querySelector('.goals__btn--cancel')
    goalNameInput = document.querySelector('#goals-panel-name')
    goalAmountInput = document.querySelector('#goals-panel-amount')
    goalDateInput = document.querySelector('#goals-panel-date')
    goalList = document.querySelector('.goals__list')
    goalAlert = document.querySelector('.goals__alert')

    goalID = 0
 
    //Okno zasilenia celu
    depositPanel = document.querySelector('.deposit')
    depositAmountInput = document.querySelector('#goal__deposit-amount')
    depositCloseBtn = document.querySelector('.deposit__btn--close')
    depositAddBtn = document.querySelector('.deposit__btn--add')
    depositAlert = document.querySelector('.deposit__alert')

    //-------------------------------------------------------------------------//

    //Dodawnie nowego celu
    addToGoalBtn = document.querySelector('.goals__btn--add')
    removeGoalBtn = document.querySelector('.goals__btn--remove')






    //Panel Główny
    financePanel = document.querySelector('.finances__panel')
    budgetNameInput = document.querySelector('#budget-panel-name')
    budgetAmountInput = document.querySelector('#budget-panel-amount')
    feeNameInput = document.querySelector('#fees-panel-name')
    feeAmountInput = document.querySelector('#fees-panel-amount')
    financeCloseBtn = document.querySelector('.finances__btn--close')

    availableMoney = document.querySelector('.options__info--money')
    transactionSearchInputIncome = document.querySelector('.transactions__search--incomes')
    transactionSearchInputExpense = document.querySelector('.transactions__search--expenses')
    totalMoney = [0]
    ID = 0



    transactionsIncomeArr = [];
    transactionsExpenseArr = [];
}

///////////////////  FUNKCJE /////////////////


//Funckja dodawnia celu

const addNewGoal = () => {

    const currentDate = new Date();
    const inputDate = new Date(goalDateInput.value);


    if (!goalNameInput.value){

        goalAlert.textContent = "Proszę podać nazwę dodawanego celu"
        return;
    } else if(goalAmountInput.value <= 0 ){
        goalAlert.textContent = "Kwota celu musi być większa od zera"
        return;
    }
    else if (!goalAmountInput.value){

        goalAlert.textContent = "Proszę podać kwotę dodawanego celu"
        return;
    }
    else if (!goalDateInput.value){

        goalAlert.textContent = "Proszę podać datę końcową dodawanego celu"
        return;
    } else if (inputDate < currentDate) {
        goalAlert.textContent = "Data nie może być wcześniejsza niż obecna"
        return
    }





    const newGoal = document.createElement('li')
    newGoal.classList.add('goals__list--item')
    newGoal.setAttribute('id', goalID)


   

    let daysLeft = Math.ceil((inputDate - currentDate) / (1000 * 60 * 60 * 24));



    newGoal.innerHTML =
        `  <p class="goal__info"> ${goalNameInput.value} : <span class="goal__paid">0</span> zł z <span
                 class="goal__to-pay">${goalAmountInput.value}</span> zł</p>
            <p class="goal__time">Data Końcowa : <span class="goal__days goal__date"> ${goalDateInput.value}</span></p>
            <p class="goal__time">Cel trwa jeszcze przez : <span class="goal__days">${daysLeft} dni</span></p>
                                    <div class="goal__btns">
                            <button class="goal__btn--deposit accept-btn">Zasil cel</button>
                            <button class="goal__btn--remove decline-btn">usuń cel</button>
                        </div>`


    goalList.appendChild(newGoal)
    goalID++;


    const depositBtn = newGoal.querySelector('.goal__btn--deposit');
    const removeBtn = newGoal.querySelector('.goal__btn--remove');

    depositBtn.addEventListener('click', () => {
        currentGoal = newGoal
        toggleDeposit();
    });

    
    removeBtn.addEventListener('click', () => {
        removeGoal(newGoal)
    });



console.log(currentDate);
console.log(inputDate);

}

//Funkcja usuwania celu 

const removeGoal = (goalElement) => {
    const goalPaidElement = goalElement.querySelector('.goal__paid');
    const goalPaidAmount = parseFloat(goalPaidElement.textContent);
    const goalId = goalElement.getAttribute('id');

    
    totalMoney.push(goalPaidAmount);
    countMoney(totalMoney);

    document.querySelectorAll(`[data-goal-id='${goalId}']`).forEach(transaction => {
        transaction.remove();
    });

    goalElement.remove();
};


// Funkcja dodawania pieniedzy do celu

const addDepositToGoal = () => {

    const depositedAmount = parseFloat(depositAmountInput.value)

    const goalPaid = document.querySelector('.goal__paid')
    const goalToPay = document.querySelector('.goal__to-pay')


    if (!depositAmountInput.value){
        depositAlert.textContent = "Proszę podać kwotę o którą chcesz doładować cel"
        return
    }
    if (depositAmountInput.value <= 0){
        depositAlert.textContent = "Kwota musi być większa od zera"
        return
    } 

    let currentgoalPaid = parseFloat(goalPaid.textContent)
    

    currentgoalPaid += depositedAmount
    goalPaid.textContent = currentgoalPaid;

    totalMoney.push(-depositedAmount);
    countMoney(totalMoney);


    const newTransaction = document.createElement('div');
    newTransaction.classList.add('transaction');
    newTransaction.setAttribute('id', ID);

    const transactionGoalDate = goalDateInput.value;
    const transactionGoalName = currentGoal.querySelector('.goal__info').textContent.split(' : ')[0]
    const goalId = currentGoal.getAttribute('id');

    newTransaction.setAttribute('data-goal-id', goalId);

    newTransaction.innerHTML = `
        <p class="transaction__name transaction__name--category small">[Wydatek]</p>
        <p class="transaction__date small">${transactionGoalDate}</p>
        <p class="transaction__name transaction__name--expenses">Zasilono cel: ${transactionGoalName}</p>
        <p class="transaction__amount transaction__amount--expenses">${depositedAmount} zł
            <button class="transaction__delete" onclick="deleteTransaction(${ID})">
                <i class="fa-solid fa-x"></i>
            </button>
        </p>
    `;

    expenseTransactions.appendChild(newTransaction);
    transactionsExpenseArr.push(newTransaction);
    ID++;

    toggleDeposit()
    
}


// Funkcja aktualizacji dni celu

const updateDaysLeft = () => {

    const currentDate = new Date();

    document.querySelectorAll('.goals__list--item').forEach(goal => {

        const goalDate = new Date(goal.querySelector('.goal__date'));
        const daysLeft = Math.ceil((goalDate - currentDate) / (1000 * 60 * 60 * 24));

        goal.querySelector('.goal__days').textContent = `${daysLeft} dni`;

    });
};
setInterval(updateDaysLeft, 1000 * 60 * 60 * 24);




//Funkcja otwierania paneli

const togglePanel = (panel) => {

    const isCurrentlyVisible = panel.style.display === 'flex';

    panel.style.display = isCurrentlyVisible ? 'none' : 'flex';

    if (!isCurrentlyVisible) {
        clearInputs();
    }
};

//Funckcja usuwania wszystkich transakcji


const deleteAllTransactions = () => {


    while (incomeTransactions.children.length > 2) {
        incomeTransactions.removeChild(incomeTransactions.lastChild);
    }
    while (expenseTransactions.children.length > 2) {
        expenseTransactions.removeChild(expenseTransactions.lastChild);
    }


    totalMoney = [0]
    ID = 0
    transactionsIncomeArr = [];
    transactionsExpenseArr = [];

    countMoney(totalMoney)

}

//Funkcja otwierania okna do zasilenia celu 

const toggleDeposit = () => {

    const isCurrentlyVisible = depositPanel.style.display === 'flex';

    depositPanel.style.display = isCurrentlyVisible ? 'none' : 'flex';

    if (!isCurrentlyVisible) {
        clearInputs();
    }
};


//Funkcja wyszukiwania transakcji

const searchTransactionIncome = (e) => {
    const searchTerm = e.target.value;
    transactionsIncomeArr.forEach(transaction => {
        const isMatch = new RegExp(searchTerm, 'i').test(transaction.textContent);
        if (!isMatch) {
            transaction.style.display = "none";
        } else {
            transaction.style.display = "flex";
        }
    });


};

const searchTransactionExpense = (e) => {
    const searchTerm = e.target.value;
    transactionsExpenseArr.forEach(transaction => {
        const isMatch = new RegExp(searchTerm, 'i').test(transaction.textContent);
        if (!isMatch) {
            transaction.style.display = "none";
        } else {
            transaction.style.display = "flex";
        }
    });


};




// Funckja dodawania nowej transkacji


const addnewTransaction = () => {


    if (!addNameInput.value) {
        addAlertText.textContent = "Proszę podać nazwę transakcji.";
        return;
    }
    if (!addAmountInput.value) {
        addAlertText.textContent = "Proszę podać kwotę transakcji.";
        return;
    }
    if (!addCategoryInput.value || addCategoryInput.value === 'none') {
        addAlertText.textContent = "Proszę wybrać kategorię transakcji.";
        return;
    }
    if (!addDateInput.value) {
        addAlertText.textContent = "Proszę podać datę transakcji.";
        return;
    }



    const newTransaction = document.createElement('div')
    newTransaction.classList.add('transaction')
    newTransaction.setAttribute('id', ID)

    const selectedCategory = checkCategory(addCategoryInput.value)

    const categoryClass = addCategoryInput.value === 'income' ? 'transaction__name--income' : 'transaction__name--expenses';
    const amountClass = addCategoryInput.value === 'income' ? 'transaction__amount--income' : 'transaction__amount--expenses';

    newTransaction.innerHTML = `
        <p class="transaction__name transaction__name--category small">${selectedCategory}</p>
                <p class="transaction__date small">${addDateInput.value}</p>
        <p class="transaction__name ${categoryClass}">${addNameInput.value}</p>
        <p class="transaction__amount ${amountClass}">${addAmountInput.value} zł
            <button class="transaction__delete" onclick="deleteTransaction(${ID})">
                <i class="fa-solid fa-x"></i>f
            </button>
        </p>

       
    `;



    if (addCategoryInput.value === 'income') {
        incomeTransactions.appendChild(newTransaction);
        transactionsIncomeArr.push(newTransaction);
    } else {
        expenseTransactions.appendChild(newTransaction);
        transactionsExpenseArr.push(newTransaction);
    }


    const transactionAmount = parseFloat(addAmountInput.value)
    const amountValue = addCategoryInput.value === 'income' ? transactionAmount : -transactionAmount;

    totalMoney.push(amountValue)
    countMoney(totalMoney)
    ID++
    togglePanel(addTransactionPanel)
    clearInputs()

    console.log(categoryClass);

}

const deleteTransaction = (id) => {

    const transactionDelete = document.getElementById(id)
    const transactionDeleteAmount = parseFloat(transactionDelete.childNodes[7].textContent)
    const goalId = transactionDelete.getAttribute('data-goal-id');

    const transactionToDeleteIndex = totalMoney.indexOf(transactionDeleteAmount)

    totalMoney.splice(transactionToDeleteIndex, 1)

    countMoney(totalMoney)


    const isIncomeTransaction = transactionDelete.childNodes[5].classList.contains('transaction__name--income')

    if (isIncomeTransaction) {
        incomeTransactions.removeChild(transactionDelete);
    } else {
        expenseTransactions.removeChild(transactionDelete);
    }

    console.log(transactionDelete.childNodes[5].classList.contains('transaction__name--income'));

    if (goalId) {
        const goalItem = document.getElementById(goalId);
        const goalPaidElement = goalItem.querySelector('.goal__paid');
        let currentPaid = parseFloat(goalPaidElement.textContent);
        currentPaid -= transactionDeleteAmount;
        goalPaidElement.textContent = currentPaid;
    }
     transactionDelete.remove();
};


const countMoney = money => {
    const newMoney = money.reduce((a, b) => a + b)
    availableMoney.textContent = `${newMoney} zł`


    if (newMoney < 0) {
        availableMoney.style.color = 'red';
        alert('Po dodaniu tej transakcji twoje dostępne środki spadną poniżej zera');
    } else {
        availableMoney.style.color = "white";
    }

}



const checkCategory = (selected) => {
    switch (selected) {
        case "income":
            return "[Przychód]";
        case "expense":
            return "[Wydatek]";
        default:
            return "[Brak kategorii]";
    }
};





//funkcja czyszczenia Inputów paneli

const clearInputs = () => {

    //Panel dodawania transakcji
    addNameInput.value = "";
    addAmountInput.value = "";
    addCategoryInput.value = "";
    addDateInput.value = "";

    //panel dodawania celi
    goalNameInput.value = "";
    goalAmountInput.value = "";
    goalDateInput.value = "";

    //panel budżetu
    budgetNameInput.value = "";
    budgetAmountInput.value = "";
    feeNameInput.value = "";
    feeAmountInput.value = "";

    //okno zasilania celu
    depositAmountInput.value = ""
}


const prepareDomEvents = () => {

    ////////// WYWOŁANIE FUNKCJI ///////////////////

    openTransactionBtn.addEventListener('click', () => togglePanel(addTransactionPanel));
    addPanelCancelBtn.addEventListener('click', () => togglePanel(addTransactionPanel));

    openGoalBtn.addEventListener('click', () => togglePanel(addGoalPanel));
    goalPanelCancelBtn.addEventListener('click', () => togglePanel(addGoalPanel));

    openBudgetBtn.addEventListener('click', () => togglePanel(financePanel));
    financeCloseBtn.addEventListener('click', () => togglePanel(financePanel));

    addPanelBtn.addEventListener('click', addnewTransaction)


    transactionSearchInputIncome.addEventListener('keyup', searchTransactionIncome)
    transactionSearchInputExpense.addEventListener('keyup', searchTransactionExpense)

    deleteAllBtn.addEventListener('click', deleteAllTransactions)


    addToGoalBtn.addEventListener('click', addNewGoal)

    depositCloseBtn.addEventListener('click', () => toggleDeposit());
    depositAddBtn.addEventListener('click', addDepositToGoal)



}



///// GŁOWNE WYWOŁANIE FUNKCJI /////

const main = () => {
    prepareDomElements()
    prepareDomEvents();

}

document.addEventListener('DOMContentLoaded', main);