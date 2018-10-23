const env = require('./.env')
const moment = require('moment');
const axios = require('axios');

//retirar depois
const baseUrl = 'http://localhost:3001'

const getStockPrice = async ticker => {
    const url = `${env.alphavanteQuoteUrl}&symbol=${ticker}.SA&apikey=${env.alphavantagetoken}`
    const res = await axios.get(url)
    return res.data
}

const getAcoesPortfolio = async portname => {
    const url = `${baseUrl}/acoes?owner=${portname}`
    const res = await axios.get(url)
    return res.data
}

const getValorAcoesPortfolio = async portname => {
    console.log('-----------------')
    const url = `${baseUrl}/acoes?owner=${portname}`
    const res = await axios.get(url)
    const datarray = res.data
    for (var i = 0; i < datarray.length; i++) {
        console.log('aqui')
        const stock = datarray[i]
        const stockprice = await getStockPrice(stock.ticker)
        stock.ultimo_preco = stockprice["Global Quote"]["05. price"]
        console.log(stock)
    }
}

module.exports = {
    getStockPrice,
    getAcoesPortfolio,
    getValorAcoesPortfolio
}




