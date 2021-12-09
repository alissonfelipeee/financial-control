const transactionsUl = document.querySelector('#transactions')
const transactionsPlusDisplay = document.querySelector("#money-plus")
const transactionsMinusDisplay = document.querySelector("#money-minus")
const transactionsBalanceDisplay = document.querySelector("#balance")
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactionsList = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactionsList = transactionsList.filter(transaction =>
         transaction.id !== ID)
    updateLocalStorage()
    init()
}

const addTransactionsIntoDOM = ({ amount, name, id}) => {
    const CSSClass = amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(amount)
    const amountCurrencyBRL = amountWithoutOperator
    .toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    const li = document.createElement('li')
    li.classList.add(CSSClass)
    li.innerHTML= `
    ${name} <span>${amountCurrencyBRL}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
    `
    transactionsUl.prepend(li)
}

const getAmountTotal = transactionsAmount => transactionsAmount
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

const getPlus = transactionsAmount => transactionsAmount
    .filter((value) => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

const getMinus = transactionsAmount => Math.abs(transactionsAmount
    .filter((value) => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

const updateBalanceValues = () => {
    const transactionsAmount = transactionsList.map(({amount }) => amount)
    const transactionsAmountTotal = getAmountTotal(transactionsAmount)
    const transactionFilterPlus = getPlus(transactionsAmount)
    const transactionFilterMinus = getMinus(transactionsAmount)

    transactionsBalanceDisplay.textContent = `${transactionsAmountTotal}`
    transactionsPlusDisplay.textContent = `${transactionFilterPlus}`
    transactionsMinusDisplay.textContent = `${transactionFilterMinus}`
}

const init = () => {
    transactionsUl.innerHTML = ''
    transactionsList.forEach(addTransactionsIntoDOM)
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions',JSON.stringify(transactionsList))
}

const generateID = () => {
    let ID = Math.round(Math.random() * 1000)
    let verifyID = transactionsList.filter(transaction =>
         transaction.id === ID).length
    if (verifyID == 1) {
        generateID()
    } else {
        return ID
    }
}

const addToTransactionsArray = (transactionName,transactionAmount) => {
    transactionsList.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    })
}

const cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value
    const transactionAmount = inputTransactionAmount.value
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

    if (isSomeInputEmpty) {
        notify('error','Preencha tanto o nome quanto o valor da transação!')
        return
    }

    addToTransactionsArray(transactionName,transactionAmount)
    verifyNotify(transactionAmount)
    init()
    updateLocalStorage()
    cleanInputs()
}

const verifyNotify = transactionAmount => transactionAmount > 0 ?
 notify('plus','A sua receita foi inserida com sucesso!') :
 notify('minus','A sua dispesa foi inserida com sucesso!')

const notify = (type,text) => {
    const divMessage = document.querySelector('.alert')
    const notify = document.createElement('div')
    const notifyExist = document.querySelector('.notify')

    if(!notifyExist) {
        if (type == 'plus') {
            notify.classList.add('notify')
            notify.classList.add('plus-notify')
        } else if (type == 'minus') {
            notify.classList.add('notify')
            notify.classList.add('minus-notify')
        } else {
            notify.classList.add('notify')
            notify.classList.add('error-notify')
        }
    
        notify.innerText = text
        divMessage.appendChild(notify)
    
        setTimeout(() => {
            notify.style.display = 'none'
            notify.remove()
        }, 5000)
    }
}

form.addEventListener('submit', handleFormSubmit)