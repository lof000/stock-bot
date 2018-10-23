
const {
    getStockPrice,
    getAcoesPortfolio,
    getValorAcoesPortfolio
} = require('./stockService')

async function tst() {
    var stock = await getStockPrice('BBAS3')
    console.log(stock)
    return stock.data
 } 

 async function tst2() {
    var stock = await getAcoesPortfolio('leandro')
    console.log(stock)
    return stock.data
 }

 async function tst3() {
    var stock = await getValorAcoesPortfolio('leandro')
 }
 

 //tst()
 //tst2()
 tst3()