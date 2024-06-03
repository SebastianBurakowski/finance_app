let currencyOne, amountOne, currencyTwo, amountTwo, swapBtn, rateInfo







const prepareDomElements = () => {
    currencyOne = document.querySelector('#currency-one')
    amountOne = document.querySelector('.currency__amount--one')


    currencyTwo = document.querySelector('#currency-two')
    amountTwo = document.querySelector('.currency__amount--two')

    swapBtn = document.querySelector('.currency__btn')
    rateInfo = document.querySelector('.currency__rate')

}







const calculate = () => {
    const host = 'api.frankfurter.app'



    fetch(`https://${host}/latest?amount=${amountOne.value}&from=${currencyOne.value}&to=${currencyTwo.value}`)
        .then(resp => resp.json())
        .then(data => {

            const rate = data.rates[currencyTwo.value]

            amountTwo.value = rate.toFixed(2)
        })
}

const swap = () => {
    const oldValue = currencyOne.value;
    currencyOne.value = currencyTwo.value;
    currencyTwo.value = oldValue;
    calculate();
}


const prepareDomEvents = () => {
    currencyOne.addEventListener('change', calculate);
    currencyTwo.addEventListener('change', calculate);
    amountOne.addEventListener('input', calculate);
    swapBtn.addEventListener('click', swap)

    calculate();


}


const main = () => {
    prepareDomElements();
    prepareDomEvents();
}

window.addEventListener('DOMContentLoaded', main);




