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


    if (!goalNameInput.value) {

        goalAlert.textContent = "Proszę podać nazwę dodawanego celu"
        return;
    } else if (goalAmountInput.value <= 0) {
        goalAlert.textContent = "Kwota celu musi być większa od zera"
        return;
    }
    else if (!goalAmountInput.value) {

        goalAlert.textContent = "Proszę podać kwotę dodawanego celu"
        return;
    }
    else if (!goalDateInput.value) {

        goalAlert.textContent = "Proszę podać datę końcową dodawanego celu"
        return;
    } else if (inputDate < currentDate) {
        goalAlert.textContent = "Data nie może być wcześniejsza niż obecna"
        return
    }



    const formData = new FormData();
    formData.append('name', goalNameInput.value);
    formData.append('amount', goalAmountInput.value);
    formData.append('date', goalDateInput.value);

    fetch('add_goals.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const newGoal = document.createElement('li');
                newGoal.classList.add('goals__list--item');
                newGoal.setAttribute('id', data.id);

                let daysLeft = Math.ceil((inputDate - currentDate) / (1000 * 60 * 60 * 24));

                newGoal.innerHTML = `
                    <p class="goal__info"> ${goalNameInput.value} : <span class="goal__paid">0</span> zł z <span
                         class="goal__to-pay">${goalAmountInput.value}</span> zł</p>
                    <p class="goal__time">Data Końcowa : <span class="goal__days goal__date"> ${goalDateInput.value}</span></p>
                    <p class="goal__time">Cel trwa jeszcze przez : <span class="goal__days">${daysLeft} dni</span></p>
                    <div class="goal__btns">
                        <button class="goal__btn--deposit accept-btn">Zasil cel</button>
                        <button class="goal__btn--remove decline-btn">usuń cel</button>
                    </div>
                `;

                goalList.appendChild(newGoal);
                goalID++;

                const depositBtn = newGoal.querySelector('.goal__btn--deposit');
                const removeBtn = newGoal.querySelector('.goal__btn--remove');

                depositBtn.addEventListener('click', () => {
                    currentGoal = newGoal;
                    toggleDeposit();
                });

                removeBtn.addEventListener('click', () => {
                    removeGoal(newGoal);
                });

                clearInputs();
            } else {
                goalAlert.textContent = "Błąd: " + data.error;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            goalAlert.textContent = "Wystąpił błąd podczas dodawania celu.";
        });
}





//funkcja wczytywania celu z bazy

const loadGoals = () => {
    fetch('get_goals.php')
        .then(response => response.json())
        .then(data => {
            data.forEach(goal => {
                const newGoal = document.createElement('li');
                newGoal.classList.add('goals__list--item');
                newGoal.setAttribute('id', goal.id);

                const currentDate = new Date();
                const inputDate = new Date(goal.date);
                let daysLeft = Math.ceil((inputDate - currentDate) / (1000 * 60 * 60 * 24));

                newGoal.innerHTML = `
                    <p class="goal__info"> ${goal.name} : <span class="goal__paid">${goal.paid}</span> zł z <span
                         class="goal__to-pay">${goal.amount}</span> zł</p>
                    <p class="goal__time">Data Końcowa : <span class="goal__days goal__date"> ${goal.date}</span></p>
                    <p class="goal__time">Cel trwa jeszcze przez : <span class="goal__days">${daysLeft} dni</span></p>
                    <div class="goal__btns">
                        <button class="goal__btn--deposit accept-btn">Zasil cel</button>
                        <button class="goal__btn--remove decline-btn">usuń cel</button>
                    </div>
                `;

                goalList.appendChild(newGoal);

                const depositBtn = newGoal.querySelector('.goal__btn--deposit');
                const removeBtn = newGoal.querySelector('.goal__btn--remove');

                depositBtn.addEventListener('click', () => {
                    currentGoal = newGoal;
                    toggleDeposit();
                });

                removeBtn.addEventListener('click', () => {
                    removeGoal(newGoal);
                });
            });
        })
        .catch(error => console.error('Error:', error));
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
    const depositedAmount = parseFloat(depositAmountInput.value);
    const goalId = currentGoal.getAttribute('id'); // Poprawne uzyskanie ID celu
    const currentDate = new Date().toISOString().split('T')[0]; // Formatowanie daty na 'YYYY-MM-DD'

    if (!depositAmountInput.value) {
        depositAlert.textContent = "Proszę podać kwotę o którą chcesz doładować cel";
        return;
    }
    if (depositAmountInput.value <= 0) {
        depositAlert.textContent = "Kwota musi być większa od zera";
        return;
    }

    const formData = new FormData();
    formData.append('goal_id', goalId);
    formData.append('amount', depositedAmount);
    formData.append('date', currentDate);

    fetch('update_goal.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const goalPaid = currentGoal.querySelector('.goal__paid');
                let currentGoalPaid = parseFloat(goalPaid.textContent);
                currentGoalPaid += depositedAmount;
                goalPaid.textContent = currentGoalPaid;

                totalMoney.push(-depositedAmount);
                countMoney(totalMoney);

                // Dodaj transakcję do sekcji wydatków
                const newTransaction = document.createElement('div');
                newTransaction.classList.add('transaction');
                newTransaction.setAttribute('id', `transaction_${data.id}`); // Ustawienie poprawnego ID z bazy danych
                console.log('New Transaction ID:', data.id); // Logowanie nowego ID transakcji

                newTransaction.innerHTML = `
                <p class="transaction__name transaction__name--category small">[Wydatek]</p>
                <p class="transaction__date small">${currentDate}</p>
                <p class="transaction__name transaction__name--expenses">Zasilono cel</p>
                <p class="transaction__amount transaction__amount--expenses">${depositedAmount} zł
                    <button class="transaction__delete" onclick="deleteTransaction(${data.id}, ${goalId})">
                        <i class="fa-solid fa-x"></i>
                    </button>
                </p>
            `;

                expenseTransactions.appendChild(newTransaction);
                transactionsExpenseArr.push(newTransaction);

                // Aktualizacja dostępnych środków
                availableMoney.textContent = `${data.availableMoney} zł`;

                toggleDeposit();
                clearInputs();
            } else {
                depositAlert.textContent = "Błąd: " + data.error;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            depositAlert.textContent = "Wystąpił błąd podczas dodawania kwoty do celu.";
        });
};
















// Funkcja aktualizacji dni celu

const updateDaysLeft = () => {
    const currentDate = new Date();

    document.querySelectorAll('.goals__list--item').forEach(goal => {
        const goalDate = new Date(goal.querySelector('.goal__date').textContent);
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

//Funckcja usuwania wszystkich transakcji +  z bazy




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
const addCategory = () => {
    const categoryName = prompt("Podaj nazwę kategorii (poprzedzając [Przychód] lub [Wydatek]):");

    if (!categoryName) {
        alert("Nazwa kategorii jest wymagana.");
        return;
    }

    const categoryType = categoryName.startsWith('[Przychód]') ? 'income' : (categoryName.startsWith('[Wydatek]') ? 'expense' : null);

    if (!categoryType) {
        alert("Nazwa kategorii musi zaczynać się od [Przychód] lub [Wydatek].");
        return;
    }

    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('type', categoryType);

    fetch('add_category.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const option = document.createElement('option');
                option.value = categoryType;
                option.textContent = categoryName;
                addCategoryInput.appendChild(option);
                alert("Kategoria została dodana.");
            } else {
                alert("Błąd podczas dodawania kategorii.");
            }
        })
        .catch(error => console.error('Error:', error));
}


// Funkcja do ładowania kategorii
const loadCategories = () => {
    fetch('get_categories.php')
        .then(response => response.json())
        .then(data => {
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.type;
                option.textContent = category.name;
                addCategoryInput.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
}



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

    let transactionAmount = parseFloat(addAmountInput.value);
    if (addCategoryInput.value === 'expense') {
        transactionAmount = -transactionAmount; // Wydatki jako wartości ujemne
    }

    const formData = new FormData();
    formData.append('name', addNameInput.value);
    formData.append('amount', transactionAmount);
    formData.append('category', addCategoryInput.value);
    formData.append('date', addDateInput.value);

    fetch('add_transaction.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Debugowanie odpowiedzi
            if (data.success) {
                const newTransaction = document.createElement('div');
                newTransaction.classList.add('transaction');
                newTransaction.setAttribute('id', `transaction_${data.id}`); // Ustawienie poprawnego ID z bazy danych

                const selectedCategory = checkCategory(addCategoryInput.value);

                const categoryClass = addCategoryInput.value === 'income' ? 'transaction__name--income' : 'transaction__name--expenses';
                const amountClass = addCategoryInput.value === 'income' ? 'transaction__amount--income' : 'transaction__amount--expenses';

                newTransaction.innerHTML = `
                <p class="transaction__name transaction__name--category small">${selectedCategory}</p>
                <p class="transaction__date small">${addDateInput.value}</p>
                <p class="transaction__name ${categoryClass}">${addNameInput.value}</p>
                <p class="transaction__amount ${amountClass}">${transactionAmount} zł
                    <button class="transaction__delete" onclick="deleteTransaction(${data.id})">
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

                // Aktualizacja dostępnych środków
                availableMoney.textContent = `${data.availableMoney} zł`;

                totalMoney.push(transactionAmount);
                countMoney(totalMoney);
                togglePanel(addTransactionPanel);
                clearInputs();
            } else {
                addAlertText.textContent = "Błąd: " + data.error;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            addAlertText.textContent = "Wystąpił błąd podczas dodawania transakcji.";
        });
}





//funkcja ładowania transkacji z bazy

const loadTransactions = () => {
    fetch('get_transactions.php')
        .then(response => response.json())
        .then(data => {
            transactionsIncomeArr = [];
            transactionsExpenseArr = [];
            totalMoney = [0]; // Resetowanie totalMoney przed załadowaniem transakcji

            data.transactions.forEach(transaction => {
                const newTransaction = document.createElement('div');
                newTransaction.classList.add('transaction');
                newTransaction.setAttribute('id', transaction.id);

                const selectedCategory = checkCategory(transaction.category);

                const categoryClass = transaction.category === 'income' ? 'transaction__name--income' : 'transaction__name--expenses';
                const amountClass = transaction.category === 'income' ? 'transaction__amount--income' : 'transaction__amount--expenses';

                newTransaction.innerHTML = `
                    <p class="transaction__name transaction__name--category small">${selectedCategory}</p>
                    <p class="transaction__date small">${transaction.date}</p>
                    <p class="transaction__name ${categoryClass}">${transaction.name}</p>
                    <p class="transaction__amount ${amountClass}">${transaction.amount} zł
                        <button class="transaction__delete" onclick="deleteTransaction(${transaction.id})">
                            <i class="fa-solid fa-x"></i>
                        </button>
                    </p>
                `;

                if (transaction.category === 'income') {
                    incomeTransactions.appendChild(newTransaction);
                    transactionsIncomeArr.push(newTransaction);
                } else {
                    expenseTransactions.appendChild(newTransaction);
                    transactionsExpenseArr.push(newTransaction);
                }

                totalMoney.push(parseFloat(transaction.amount));
            });

            // Po załadowaniu wszystkich transakcji, oblicz dostępne środki
            countMoney(totalMoney);

            // Aktualizacja dostępnych środków na podstawie obliczeń z backendu
            availableMoney.textContent = `${data.availableMoney} zł`;
        })
        .catch(error => console.error('Error:', error));
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


//funkcja usuwania transakcji + baza

function deleteTransaction(transactionId, goalId) {
    console.log('Deleting Transaction ID:', transactionId, 'Goal ID:', goalId); // Logowanie ID transakcji i celu

    const formData = new FormData();
    formData.append('transaction_id', transactionId);
    if (goalId) {
        formData.append('goal_id', goalId);
    }

    fetch('delete_transaction.php', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            return response.text().then(text => {
                console.log('Response text:', text); // Logowanie odpowiedzi
                return JSON.parse(text);
            });
        })
        .then(data => {
            if (data.success) {
                const transactionElement = document.querySelector(`#transaction_${transactionId}`);
                console.log('Transaction Element:', transactionElement); // Logowanie elementu transakcji

                if (transactionElement) {
                    transactionElement.remove();
                    // Aktualizacja wyświetlanej kwoty dostępnych środków
                    document.querySelector('.options__info--money').textContent = `${data.availableMoney} zł`;

                    // Jeśli istnieje goalId, zaktualizuj także goal__paid
                    if (goalId) {
                        const goalPaidElement = document.querySelector(`#goal_${goalId} .goal__paid`);
                        if (goalPaidElement) {
                            const newPaidAmount = parseFloat(goalPaidElement.textContent) - parseFloat(depositedAmount);
                            goalPaidElement.textContent = `${newPaidAmount} zł`;
                        } else {
                            console.error('Goal Paid Element not found');
                        }
                    }
                } else {
                    console.error('Transaction Element not found');
                }
            } else {
                console.error('Błąd:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));
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


//usuwanie wszystkich trans + baza 

//Funckcja usuwania wszystkich transakcji +  z bazy


const deleteAllTransactions = () => {
    fetch('delete_all_transactions.php', {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Usuwanie transakcji z widoku aplikacji
                while (incomeTransactions.children.length > 2) {
                    incomeTransactions.removeChild(incomeTransactions.lastChild);
                }
                while (expenseTransactions.children.length > 2) {
                    expenseTransactions.removeChild(expenseTransactions.lastChild);
                }

                // Resetowanie danych w JS
                totalMoney = [0];
                ID = 0;
                transactionsIncomeArr = [];
                transactionsExpenseArr = [];

                // Aktualizacja dostępnych środków
                countMoney(totalMoney);
            } else {
                console.error('Błąd:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));
}


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

    addPanelCategoryBtn.addEventListener('click', addCategory);


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
    loadCategories();
    loadTransactions();
    loadGoals();


}

document.addEventListener('DOMContentLoaded', main);