//strona logowania
let signInBtn, signUpBtn, signInDiv, signUpDiv

// formularz rejestracji

let userName, userSurname, email, password, passwordRepeat, signUpAlert

//formularz logowania

let loginName, loginPassword, signInAlert, signupSubmitBtn, showPassBtn


//przyciski
let closeBtns, signinSubmitBtn



const prepareDomElements = () => {
    //pobieranie elementów ze strony logowania

    signInBtn = document.querySelector('.login__btn--signin')
    signUpBtn = document.querySelector('.login__btn--signup')
    signInDiv = document.querySelector('.signin__container')
    signUpDiv = document.querySelector('.signup__container')


    //pobieranie elementów z formularza rejestracji
    userName = document.querySelector('#name')
    userSurname = document.querySelector('#surname')
    email = document.querySelector('#e-mail')
    password = document.querySelector('#password1')
    passwordRepeat = document.querySelector('#password2')
    signUpAlert = document.querySelector('.signup__alert')

    //pobieranie elementów z formularza logowania
    loginName = document.querySelector('#login-mail')
    loginPassword = document.querySelector('#login-password')
    signInAlert = document.querySelector('.singin__alert')


    //pobieranie przycisków z formularzy oraz strony logowania

    closeBtns = document.querySelectorAll('.close-btn')
    signinSubmitBtn = document.querySelector('.signin__btn')
    signupSubmitBtn = document.querySelector('.signup__btn')
    showPassBtn = document.querySelector('.signup__show-btn')
 

}




//Funckje sterowania oknami formularzy
const OpenSignIn = () => {
    signInDiv.style.display = "flex"

}


const OpenSignUp = () => {
    signUpDiv.style.display = "flex"

}

const closeHandle = (e) => {
    e.target.parentNode.style.display = "none"
    
}






//Funckja pokazywania wpisanego hasła
const showPassword = () => {

    if( passwordRepeat.type === "password" || password.type === "password"){
        password.type = "text"
        passwordRepeat.type = "text"
    } else if (passwordRepeat.type === "text" || password.type === "text") {
        passwordRepeat.type = "password"
        password.type = "password"
    }

    showPassBtn.classList.toggle('show-pass')
    
    
}


//Sprawdzanie czy hasło spełnia podane wymagania

const checkPasswords = (pass1, pass2, msg) => {
    if (pass1.value !== pass2.value) {
        msg.textContent = "Podane hasła nie są identyczne"
        return false;
    } else {
        console.log("ok");
        return true;
    }
}


const passwordValidation = (pass, msg) => {
    const specialCharacters = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    const uppercaseLetters = /[A-Z]/;

    if (pass.value.length < 8) {
        msg.textContent = "Hasło jest za krótkie. Minimum 8 znaków"
        return false;
    } else if (!specialCharacters.test(pass.value)) {
        msg.textContent = "Hasło musi zawierać znak specjalny"
        return false;
    } else if (!uppercaseLetters.test(pass.value)) {
        msg.textContent = "Hasło musi zawierać minimum jedną wielką literę"
        return false;
    } else {
        return checkPasswords(password, passwordRepeat, signUpAlert);
    }
}







// Funkcja obsługująca rejestrację

const handleSignup = (e) => {
    e.preventDefault();
    if (passwordValidation(password, signUpAlert)) {
        const formData = new FormData();
        formData.append('email', email.value);
        formData.append('name', userName.value);
        formData.append('surname', userSurname.value);
        formData.append('password', password.value);

        fetch('register.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                signUpAlert.textContent = "Konto Utworzone, aby przejść dalej zaloguj się";
                signUpAlert.style.color = "white";
            })
            .catch(error => console.error('Error:', error));
    }
};
// Funkcja obsługująca logowanie
const handleSignin = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', loginName.value);
    formData.append('password', loginPassword.value);

    fetch('login.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            if (data === "Logowanie pomyślne.") {
                window.location.href = "main.html"; 
            } else {
                const signInAlert = document.querySelector('.signin__alert');
                signInAlert.textContent = data; 
            }
        })
        .catch(error => console.error('Error:', error));
};

// Funkcja przygotowująca nasłuchiwacze zdarzeń
const prepareDomEvents = () => {

    signupSubmitBtn.addEventListener('click', handleSignup);
    signinSubmitBtn.addEventListener('click', handleSignin);

     showPassBtn.addEventListener('click', showPassword)

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeHandle)
    })


    signInBtn.addEventListener('click', OpenSignIn)
    signUpBtn.addEventListener('click', OpenSignUp)

};



const main = () => {
    prepareDomElements();
    prepareDomEvents();
}

window.addEventListener('DOMContentLoaded', main);