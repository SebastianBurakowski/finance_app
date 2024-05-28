//Głowna strona przyciski
let openTransactionBtn, openGoalBtn, openBudgetBtn;
let availableMoney, transactionSearchInputIncome, transactionSearchInputExpense, transactionsIncomeArr, transactionsExpenseArr



//Panel dodawania transakcjji
let addTransactionPanel, addNameInput, addAmountInput, addCategoryInput, addDateInput
let ID, category, categoryPicked, totalMoney
let addPanelBtn, addPanelCategoryBtn, addPanelCancelBtn
let addPanelCategoryParagraph, incomeTransactions, expenseTransactions



//Panel celów finansowych
let addGoalPanel, goalPanelCancelBtn, goalNameInput, goalAmountInput, goalDateInput;
//Dodawnie nowego celu
let addToGoalBtn, removeGoalBtn
//Okno dodawnia celu
let depositAmountInput, depositAddBtn, depositCloseBtn


//Panel Finansów i budżetu
let financePanel, budgetNameInput, budgetAmountInput, feeNameInput, feeAmountInput, financeCloseBtn;








const prepareDomElements = () => {

    //////// POBIERANIE ELEMENTÓW STRONY //////




    //przyciski głownej strony
    openTransactionBtn = document.querySelector('.options__btn--add')
    openGoalBtn = document.querySelector('.options__btn--goal')
    openBudgetBtn = document.querySelector('.options__btn--fee')

 


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




    //-----------------------------------------------------------------------//
    //Panel celów finansowych
    addGoalPanel = document.querySelector('.goals__panel')
    goalPanelCancelBtn = document.querySelector('.goals__btn--cancel')
    goalNameInput = document.querySelector('#goals-panel-name')
    goalAmountInput = document.querySelector('#goals-panel-amount')
    goalDateInput = document.querySelector('#goals-panel-date')

    //Dodawnie nowego celu
    addToGoalBtn = document.querySelector('.goal__btn--add')
    removeGoalBtn = document.querySelector('.goal__btn--remove')

    //Okno dodawnia celu
    depositPanel = document.querySelector('.deposit')
    depositAmountInput = document.querySelector('#goal__deposit-amount')
    depositCloseBtn = document.querySelector('.deposit__btn--close')
    depositAddBtn = document.querySelector('.deposit__btn--add')
    openDepositBtns = document.querySelectorAll('.goal__btn--deposit')



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




//Funkcja otwierania paneli

const togglePanel = (panel) => {

    const isCurrentlyVisible = panel.style.display === 'flex';

    panel.style.display = isCurrentlyVisible ? 'none' : 'flex';

    if (!isCurrentlyVisible) {
        clearInputs();
    }
};


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
                <i class="fa-solid fa-x"></i>
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

    openDepositBtns.forEach(btn => {
        btn.addEventListener('click', toggleDeposit)

    });

    depositCloseBtn.addEventListener('click', toggleDeposit)

    addPanelBtn.addEventListener('click', addnewTransaction)


    transactionSearchInputIncome.addEventListener('keyup', searchTransactionIncome)
    transactionSearchInputExpense.addEventListener('keyup', searchTransactionExpense)
   


}



///// GŁOWNE WYWOŁANIE FUNKCJI /////

const main = () => {
    prepareDomElements()
    prepareDomEvents();

}

document.addEventListener('DOMContentLoaded', main);