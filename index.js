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

            fetch('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty')
                .then(res => res.json())
                .then(body => {

                    let titles = `Ycombinator last posts\n\n`

                    for (let i = 0; i != 3; i++) {
                        // console.log(body[i])
                        fetch(`https://hacker-news.firebaseio.com/v0/item/${body[i]}.json?print=pretty`)
                            .then(res => res.json())
                            .then(body => {
                                titles = titles + `[${body.title}](${body.url})\n\n`
                            })
                    }
                    sleep(1000).then(() => {
                        ctx.telegram.sendMessage(ctx.message.chat.id, `${titles}`, { parse_mode: 'Markdown' })
                      });
                })
        })
    })
bot.launch();
