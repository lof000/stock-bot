const env = require('./.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const moment = require('moment')

const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')

const bot = new Telegraf(env.token)

const {
    getOperations,
    getStockPrice,
    getPosicaoLS,
    calculateLongShort
} = require('./stockService')

const formatarData = data =>
    data ? moment(data).format('DD/MM/YYYY') : ''

const botoesOperacoes = operacoes => {
    const botoes = operacoes.map(item => {
        const data = item.data_montagem ?
            `${moment(item.data_montagem).format('DD/MM/YYYY')} - ` : ''
        return [Markup.callbackButton(`${data}${item.descricao}`, `mostrar ${item.id}`)]
    })
    return Extra.markup(Markup.inlineKeyboard(botoes, { columns: 1 }))
}

bot.start(ctx => {
    const nome = ctx.update.message.from.first_name
    ctx.reply(`Seja bem vindo, ${nome}!`)
})

//comand - show all the operations
bot.command('ops', async ctx => {
    const ops = await getOperations()
    ctx.reply(`Estas são as operacoes `, botoesOperacoes(ops))
})

bot.action(/mostrar (.+)/, async ctx => {
    await exibirOperacao(ctx, ctx.match[1])
})

const exibirOperacao = async (ctx, opId) => {
    const operacao = await getPosicaoLS(opId)
    const dtinicio = operacao.data_montagem ?
        `\n<b>Montada em:</b> ${formatarData(operacao.data_montagem)}` : ''
    const msg = `
        <b>${operacao.descricao}</b></br>
        <h3>Long ${operacao.long}</h3></br>
        Quantidade:${operacao.qtde_long}</br>
        Mercado:${operacao.valor_mercado_long}</br>
        Resultado pta long:${operacao.resultado_ponta_long}</br>
        <br>
        <h3>Short ${operacao.short}</h3></br>
        Quantidade:${operacao.qtde_short}</br>
        Mercado:${operacao.valor_mercado_short}</br>
        Resultado pta short:${operacao.resultado_ponta_short}</br>
        <br>
        Resultado da operacao:${operacao.resultado_operacao}</br>
        <h3>${operacao.action}</h3>
        `
        ctx.reply(msg)

    /*
    if (novaMsg) {
        ctx.reply(msg, botoesTarefa(tarefaId))
    } else {
        ctx.editMessageText(msg, botoesTarefa(tarefaId))
    }
    */
}

bot.startPolling()