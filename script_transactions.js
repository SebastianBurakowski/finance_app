const addTransactionBtn = document.querySelector('.options__btn--add')
const addTransactionPanel = document.querySelector('.add-panel')
const nameInput = document.querySelector('#add-panel-name')
const amountInput = document.querySelector('#add-panel-amount')
const categoryInput = document.querySelector('#add-panel-category')
const dateInput = document.querySelector('#add-panel-date')

let isVisible = false;

const addPanelCancelBtn = document.querySelector('.add-panel__btn--cancel')


const toggleTransactionPanel = () => {
    addTransactionPanel.style.display = isVisible ? 'none' : 'flex';

    isVisible = !isVisible

    if (addTransactionPanel.style.display === "none"){
        nameInput.value = "";
        amountInput.value = "";
        categoryInput.value = "";
        dateInput.value = "";
    }
};


const closeAddPanel = () => {
    toggleTransactionPanel();
    clearInputs()
    
}


addTransactionBtn.addEventListener('click', toggleTransactionPanel)
addPanelCancelBtn.addEventListener('click', toggleTransactionPanel )