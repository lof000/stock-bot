const env = require('./.env')
const moment = require('moment');
const axios = require('axios');

//retirar depois
const baseUrl = 'http://localhost:3001'

const getOperations = async () => {
    const res = await axios.get(`${baseUrl}/trades`)
    return res.data
}

const getStockPrice = async ticker => {
    const url = `${env.alphavanteQuoteUrl}&symbol=${ticker}.SA&apikey=${env.alphavantagetoken}`
    const res = await axios.get(url).catch(error => {
        console.log(error);
    })
    //console.log(res.data)
    return res.data
}

//GET POSITION ON ONE LONG SHORT OPERATION
const getPosicaoLS = async idtrade =>{
    //obtendo a operaco long short do banco
    const url = `${baseUrl}/trades/${idtrade}`

    //get operation config
    const res = await axios.get(url)
    const op_long_short = res.data

    //get current stock price
    const preco_ticker_long = await getStockPrice(op_long_short.long)
    const preco_ticker_short = await getStockPrice(op_long_short.short)

    //calculating....
    const total_long = parseFloat(preco_ticker_long["Global Quote"]["05. price"] * op_long_short.qtde_long)
    const total_short = parseFloat(preco_ticker_short["Global Quote"]["05. price"] * op_long_short.qtde_short)

    op_long_short.valor_mercado_long = total_long
    op_long_short.valor_mercado_short = total_short
    op_long_short.ratio_entrada = op_long_short.compra_long / op_long_short.compra_short
    op_long_short.ratio_atual = parseFloat(preco_ticker_long["Global Quote"]["05. price"])/parseFloat(preco_ticker_short["Global Quote"]["05. price"])
    op_long_short.ratio_stop_loss = op_long_short.ratio_entrada * 0.9

    op_long_short.resultado_ponta_long = total_long - (op_long_short.qtde_long * op_long_short.compra_long)
    op_long_short.resultado_ponta_short = (op_long_short.qtde_short * op_long_short.compra_short) - total_short
    op_long_short.resultado_operacao = op_long_short.resultado_ponta_long + op_long_short.resultado_ponta_short

    op_long_short.action = await getAction(op_long_short)

    return op_long_short

}

//GET POSITION ON ONE LONG SHORT OPERATION
const calculateLongShort = async (long,short,qtde_short) =>{
    const preco_ticker_long = await getStockPrice(long)
    const preco_ticker_short = await getStockPrice(short)

    const total_short = parseFloat(preco_ticker_short["Global Quote"]["05. price"] * qtde_short)
    const qtde_long = Math.round(total_short/parseFloat(preco_ticker_long["Global Quote"]["05. price"]))

    const ret = {}
    ret.long = long
    ret.qtde_long = qtde_long
    ret.cotacao_long = parseFloat(preco_ticker_long["Global Quote"]["05. price"])
    ret.valor_long = ret.cotacao_long * qtde_long
    ret.short = short
    ret.qtde_short = qtde_short
    ret.cotacao_short = parseFloat(preco_ticker_short["Global Quote"]["05. price"])
    ret.total_short = total_short
    ret.ratio = ret.cotacao_long / ret.cotacao_short
    
    return ret
}


const getAction = async op_long_short =>{
    //acao
    var action = "-"
    if (op_long_short.ratio_atual < op_long_short.ratio_stop_loss){
        action = "STOP-LOSS"
    } else{
        if ( (op_long_short.ratio_atual <= op_long_short.ratio_teto) & (op_long_short.ratio_atual >= op_long_short.ratio_stop_loss) ){
            action = "MONTAR"
        }else{
            if ( (op_long_short.ratio_atual >= op_long_short.ratio_teto) & (op_long_short.ratio_atual <= op_long_short.ratio_target) ){
                action = "MONTAR"
            }else{
                action = "STOP-GAIN"
            }
        }
    }
    return action
}


//-----------------------------
//OLD
const getAcoesPortfolio = async portname => {
    const url = `${baseUrl}/acoes?owner=${portname}`
    const res = await axios.get(url).catch(error => {
        console.log(error);
    })
    return res.data
}

const getValorAcoesPortfolio = async portname => {
    const url = `${baseUrl}/acoes?owner=${portname}`
    const res = await axios.get(url)
    const datarray = res.data
    var port_acoes = {"total_acoes":0}
    var tot_acoes = 0.0
    var acoes = []
    for (var i = 0; i < datarray.length; i++) {
        const stock = datarray[i]
        const stockprice = await getStockPrice(stock.ticker)
        stock.ultimo_preco = stockprice["Global Quote"]["05. price"]
        tot_acoes = tot_acoes + ( Number(stock.quantidade) * parseFloat(stock.ultimo_preco) )
        acoes.push(stock)
    }
    port_acoes.total_acoes = tot_acoes
    port_acoes.acoes = acoes
    return port_acoes
}
//-----------------------------

module.exports = {
    getOperations,
    getStockPrice,
    getPosicaoLS,
    calculateLongShort
}




