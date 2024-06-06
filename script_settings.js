let personalBtn, passwordBtn, emailBtn, deleteAccountBtn, closePanelBtns, acceptBtns, declineBtn;
let personalPanel, passwordPanel, emailPanel, deletePanel;

let passwordAlert, emailAlert, personalAlert

let personalNameInput, personalSurnameInput, emailInput, password1Input, password2Input

let personalChangeBtn, emailChangeBtn, passwordChangeBtn, accountDeleteBtn

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

    passwordAlert = document.querySelector('.password__alert')
    emailAlert = document.querySelector('.email__alert')
    personalAlert = document.querySelector('.personal__alert')

    personalNameInput = document.querySelector('#personal-panel-name')
    personalSurnameInput = document.querySelector('#personal-panel-surname')
    emailInput = document.querySelector('#email-panel-input');
    password1Input = document.querySelector('#password1')
    password2Input = document.querySelector('#password2')


    personalChangeBtn = document.querySelector('.personal__btn--add')
    emailChangeBtn = document.querySelector('.email__btn--add')
    passwordChangeBtn = document.querySelector('.password__btn--add')
    accountDeleteBtn = document.querySelector('.delete__panel__btn--add')
}

const prepareDomEvents = () => {
    personalBtn.addEventListener("click", () => {
        openPanel(personalPanel)
    });

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

    declineBtn.addEventListener('click', () => {
        closePanel(declineBtn.closest('section'))
    });

    personalChangeBtn.addEventListener('click', updatePersonalData);

    emailChangeBtn.addEventListener('click', updateEmail)

    passwordChangeBtn.addEventListener('click', updatePassword)

    accountDeleteBtn.addEventListener('click', deleteAccount)
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

const updatePersonalData = () => {
    const name = personalNameInput.value
    const surname = personalSurnameInput.value


    if (!name) {
        personalAlert.textContent = "Proszę podać imie"
        return;
    } else if (!surname) {
        personalAlert.textContent = "Proszę podać nazwisko"
        return;
    }

    fetch('update_personal.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `name=${encodeURIComponent(name)}&surname=${encodeURIComponent(surname)}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                closePanel(personalPanel);
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


const updateEmail = () => {
    const newEmail = emailInput.value

    if (!newEmail) {
        emailAlert.textContent = "proszę podać email"
        return
    }

    fetch('update_email.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(newEmail)}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                closePanel(emailPanel);
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


const updatePassword = () => {

    const password1 = password1Input.value
    const password2 = password2Input.value

    const specialCharacters = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    const uppercaseLetters = /[A-Z]/;

    if (password1.length < 8) {
        passwordAlert.textContent = "Hasło musi mieć min 8 znaków"
    }

    else if (password1 !== password2) {
        passwordAlert.textContent = "Hasła nie są identyczne"
        return;

    } else if (!specialCharacters.test(password1)) {
        passwordAlert.textContent = "Hasło musi zawierać znak specjalny"
        return;
    } else if (!uppercaseLetters.test(password1)) {
        passwordAlert.textContent = "Hasło musi zawierać minimum jedną wielką literę";
        return;
    }

    fetch('update_password.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `password=${encodeURIComponent(password1)}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                closePanel(passwordPanel);
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const deleteAccount = () => {
    fetch('delete_account.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                window.location.href = 'logout.php'; // Wylogowanie użytkownika po usunięciu konta
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const main = () => {
    prepareDomElements();
    prepareDomEvents();
}

window.addEventListener('DOMContentLoaded', main);
