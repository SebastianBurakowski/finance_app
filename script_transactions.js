//Głowna strona przyciski
let openTransactionBtn, openGoalBtn, openBudgetBtn;


//Panel dodawania transakcjji
let addTransactionPanel, addNameInput, addAmountInput, addCategoryInput, addDateInput, addPanelCancelBtn;


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
    addPanelCancelBtn = document.querySelector('.add-panel__btn--cancel')

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



    //Panel Finansów i budżetu
    financePanel = document.querySelector('.finances__panel')
    budgetNameInput = document.querySelector('#budget-panel-name')
    budgetAmountInput = document.querySelector('#budget-panel-amount')
    feeNameInput = document.querySelector('#fees-panel-name')
    feeAmountInput = document.querySelector('#fees-panel-amount')
    financeCloseBtn = document.querySelector('.finances__btn--close')
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



}



///// GŁOWNE WYWOŁANIE FUNKCJI /////

const main = () => {
    prepareDomElements()
    prepareDomEvents();

}

document.addEventListener('DOMContentLoaded', main);