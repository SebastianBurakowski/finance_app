//pobieranie elementów ze strony logowania

const SignInBtn = document.querySelector('.login__btn--signin')
const signUpBtn = document.querySelector('.login__btn--signup')
const signInDiv = document.querySelector('.signin__container')
const signUpDiv = document.querySelector('.signup__container')


//pobieranie elementów z formularza rejestracji
const name = document.querySelector('#name')
const surname = document.querySelector('#surname')
const email = document.querySelector('#email')
const password = document.querySelector('#password1')
const passwordRepeat = document.querySelector('#password2')
const signUpAlert = document.querySelector('.signup__alert')

//pobieranie elementów z formularza logowania
const loginName = document.querySelector('#login-mail')
const loginPassword = document.querySelector('#login-password')
const signInAlert = document.querySelector('.singin__alert')


//pobieranie przycisków z formularzy oraz strony logowania

const closeBtns = document.querySelectorAll('.close-btn')
const signinSubmitBtn = document.querySelector('.signin__btn')
const signupSubmitBtn = document.querySelector('.signup__btn')
const showPassBtn = document.querySelector('.signup__show-btn')

//pobieranie elementów z sekcji edukacja




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

    } else {
        window.location.href = "main.html"
    }

}


const passwordValidation = (pass, msg) => {
    const specialCharacters = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    const uppercaseLetters = /[A-Z]/;

    if(pass.value.length < 8 ){
        msg.textContent = "Haslo jest za krótkie. Minimum 8 znaków"
    } else if(!specialCharacters.test(pass.value)){
        msg.textContent = "Hasło musi zawierać znak specjalny"
    } else if(!uppercaseLetters.test(pass.value)){
        msg.textContent = "hasło musi zawierać minimum jedną wielka litere"
    } else{
        msg.textContent = "ok"
        checkPasswords(password,passwordRepeat, signUpAlert)
        
    }
    
}








// logowanie

const loginHandle = () => {
    window.location.href = "main.html"
}





//Wywołanie funkcji na odpowiednich elementach

signinSubmitBtn.addEventListener('click', loginHandle)

showPassBtn.addEventListener('click', showPassword)

closeBtns.forEach(btn => {
    btn.addEventListener('click', closeHandle)
})


SignInBtn.addEventListener('click', OpenSignIn)
signUpBtn.addEventListener('click', OpenSignUp)



signupSubmitBtn.addEventListener('click', e =>{
    e.preventDefault();

    passwordValidation(password, signUpAlert)

})