const { Telegraf } = require('telegraf')
const fetch = require('node-fetch');
const xml2js = require('xml2js');

if(!process.env.BOTONEWSTOKEN) {
    return console.error("Please set BOTONEWSTOKEN")
}
if(!process.env.BOTONEWSTWITTERTOKEN) {
    return console.error("Please set BOTONEWSTWITTERTOKEN")
}

const bot = new Telegraf(process.env.BOTONEWSTOKEN);

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

let tweetsphp = `[@php_ceo](https://twitter.com/php_ceo) last tweets :\n\n\n`
let tweetsneckbeard = `[@neckbeardhacker](https://twitter.com/NeckbeardHacker) last tweets :\n\n\n`
let tweetshipster = `[@hispterhacker](https://twitter.com/hipsterhacker) last tweets :\n\n\n`

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

                fetch('https://api.twitter.com/2/users/278523798/tweets', { 
                    method: 'get', 
                    headers:{'Authorization': `Bearer ${process.env.BOTONEWSTWITTERTOKEN}`}
                    })
                    .then(res => res.json())
                    .then(body => {

                        for (let i = 0; i != 3; i++) {
                            tweetsneckbeard = tweetsneckbeard + `[${body.data[i].text}](https://twitter.com/NeckBeardHacker/status/${body.data[i].id})\n\n===================\n\n`
                        }
                    })

                fetch('https://api.twitter.com/2/users/261546340/tweets', { 
                    method: 'get', 
                    headers:{'Authorization': `Bearer ${process.env.BOTONEWSTWITTERTOKEN}`}
                    })
                    .then(res => res.json())
                    .then(body => {

                        for (let i = 0; i != 3; i++) {
                            tweetshipster = tweetshipster + `[${body.data[i].text}](https://twitter.com/hipsterhacker/status/${body.data[i].id})\n\n===================\n\n`
                        }
                    })

                fetch('https://api.twitter.com/2/users/2317524115/tweets', { 
                    method: 'get', 
                    headers:{'Authorization': `Bearer ${process.env.BOTONEWSTWITTERTOKEN}`}
                    })
                    .then(res => res.json())
                    .then(body => {

                        for (let i = 0; i != 3; i++) {
                            tweetsphp = tweetsphp + `[${body.data[i].text}](https://twitter.com/php_ceo/status/${body.data[i].id})\n\n===================\n\n`
                        }
                    })
                    
                    sleep(1000).then(() => {
                        ctx.telegram.sendMessage(ctx.message.chat.id, `${tweetsneckbeard}${tweetshipster}${tweetsphp}`, { parse_mode: 'Markdown' })
                      });

                    

                })
        })
    })

bot.launch();

