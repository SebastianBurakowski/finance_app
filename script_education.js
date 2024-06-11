let accordion, accordionBtn
let phoneNav, hamburger

const prepareDomElements = () => {
    accordion = document.querySelector('.acordeon')
    accordionBtn = document.querySelectorAll('.acordeon__btn')
    phoneNav = document.querySelector('.nav_phone')
    hamburger = document.querySelector('.fa-bars')
}





// Funkcja pokazująca lub ukrywająca odpowiedz na pytanie
function showAccordion() {
    if (this.nextElementSibling.classList.contains('acordeon__info--show')) {
        this.nextElementSibling.classList.remove('acordeon__info--show')
    } else {
        closeAllAccordion();
        this.nextElementSibling.classList.toggle('acordeon__info--show')
    
    }

    

}


const showNav = () => {
    console.log("object");
    phoneNav.classList.toggle('show')
    
}


// Funckaj zamykająca daną odpowiedź
const closeAllAccordion = () => {
    const accordionElements = document.querySelectorAll('.acordeon__info')

    accordionElements.forEach(el => {
        el.classList.remove('acordeon__info--show')
    })

}




const prepareDomEvents = () => {

    hamburger.addEventListener('click', showNav)
    accordionBtn.forEach(btn =>
        btn.addEventListener('click', showAccordion),


    )


}


const main = () => {
    prepareDomElements();
    prepareDomEvents();
}

window.addEventListener('DOMContentLoaded', main);
