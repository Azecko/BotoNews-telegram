const { Telegraf } = require('telegraf')
const fetch = require('node-fetch');
const xml2js = require('xml2js');

const bot = new Telegraf(process.env.BOTONEWSTOKEN);

bot.command('getfeed', (ctx) => {
    fetch('https://go.epfl.ch/feed')
    .then(res => res.text())
    .then(body => {
        xml2js.parseString(body, (err, result) => {
            if(err) {
                throw err;
            }

            const json = JSON.stringify(result, null, 4);
            const superjson = JSON.parse(json)
            //console.log(superjson.feed.entry)

            let messages = `Les derniers liens raccourcis sur go.epfl.ch\n\n`

             for (let i = 0; i != 3; i++) {
                messages = messages + `${superjson.feed.entry[i].title[0]._}\n\n`
            }
            ctx.telegram.sendMessage(ctx.message.chat.id, `${messages}`)
        })
    })
bot.launch();
