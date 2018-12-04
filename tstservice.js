
const {
    getStockPrice,
    getAcoesPortfolio,
    getValorAcoesPortfolio,
    getPosicaoLS,
    calculateLongShort
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
    console.log(stock)
 }
 
 async function tst4() {
   var stock = await getPosicaoLS(1)
   console.log(stock)
   var stock2 = await getPosicaoLS(2)
   console.log(stock2)
}

async function tst5() {
   var stock = await calculateLongShort("BRML3","IGTA3",100)
   console.log(stock)
}

 //tst()
 //tst2()
 //tst3()
 //tst4()
 tst5()