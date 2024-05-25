let personalBtn, passwordBtn, emailBtn, deleteAccountBtn, closePanelBtns, acceptBtns, declineBtn;
let personalPanel, passwordPanel, emailPanel, deletePanel;

const prepareDomElements = () => {
    personalBtn = document.querySelector('.settings__btn--personal');
    passwordBtn = document.querySelector('.settings__btn--password');
    emailBtn = document.querySelector('.settings__btn--email');
    deleteAccountBtn = document.querySelector('.settings__btn--delete');
    closePanelBtns = document.querySelectorAll('.close-btn');
    acceptBtns = document.querySelectorAll('.accept-btn');
    declineBtn = document.querySelector('.decline-btn');

    personalPanel = document.querySelector('.personal');
    passwordPanel = document.querySelector('.password');
    emailPanel = document.querySelector('.email');
    deletePanel = document.querySelector('.delete');
}

const prepareDomEvents = () => {
   
        personalBtn.addEventListener("click", ()=>{
            openPanel(personalPanel)
        })
    passwordBtn.addEventListener('click', () => {
        openPanel(passwordPanel);
    });

   
 
        emailBtn.addEventListener('click', () => {
            openPanel(emailPanel);
        });
    

   
        deleteAccountBtn.addEventListener('click', () => {
            openPanel(deletePanel);
        });
    

    closePanelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closePanel(btn.closest('section'));
        });
    });

    declineBtn.addEventListener('click', ()=>{
        closePanel(declineBtn.closest('section'))
    })
}

const openPanel = (panel) => {
    if (panel) {
        panel.style.display = 'block';
    }
}

const closePanel = (panel) => {
    if (panel) {
        panel.style.display = 'none';
    }
}

const main = () => {
    prepareDomElements();
    prepareDomEvents();
}

window.addEventListener('DOMContentLoaded', main);
