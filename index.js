const { Telegraf } = require('telegraf')
const fetch = require('node-fetch');
const xml2js = require('xml2js');
const config = require("./config.json")

var fetchtweets = require("./lib/fetchtweets.js")

if(!config.BOTONEWSTOKEN) {
    return console.error("Please set BOTONEWSTOKEN")
}
if(!config.BOTONEWSTWITTERTOKEN) {
    return console.error("Please set BOTONEWSTWITTERTOKEN")
}

const bot = new Telegraf(config.BOTONEWSTOKEN);

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

var tweetsphp = `[@php_ceo](https://twitter.com/php_ceo) last tweets :\n\n\n`
var tweetsneckbeard = `[@neckbeardhacker](https://twitter.com/NeckbeardHacker) last tweets :\n\n\n`
var tweetshipster = `[@hispterhacker](https://twitter.com/hipsterhacker) last tweets :\n\n\n`
var newsepfl = `Les dernières news de l'EPFL\n\n`

bot.command('getfeed', async (ctx) => {
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

            var messages = `Les derniers liens raccourcis sur go.epfl.ch\n\n`

            for (let i = 0; i != 3; i++) {
                messages = messages + `${superjson.feed.entry[i].title[0]._}\n\n`
            }
            ctx.telegram.sendMessage(ctx.message.chat.id, `${messages}`)

            
            fetch('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty')
                .then(res => res.json())
                .then(body => {

                    var titles = `Ycombinator last posts\n\n`

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

                //tweetsneckbeard = tweetsneckbeard + fetchtweets("278523798", "neckbeardhacker");
                fetchtweets("278523798", "neckbeardhacker").then(function(result) {
                    tweetsneckbeard = tweetsneckbeard + result
                })
                //console.log(tweetsneckbeard)
                // fetch('https://api.twitter.com/2/users/278523798/tweets', { 
                //     method: 'get', 
                //     headers:{'Authorization': `Bearer ${config.BOTONEWSTWITTERTOKEN}`}
                //     })
                //     .then(res => res.json())
                //     .then(body => {

                //         for (let i = 0; i != 3; i++) {
                //             tweetsneckbeard = tweetsneckbeard + `[${body.data[i].text}](https://twitter.com/NeckBeardHacker/status/${body.data[i].id})\n\n===================\n\n`
                //         }
                //     })

                fetchtweets("261546340", "hipsterhacker").then(function(result) {
                    tweetshipster = tweetshipster + result
                })

                // fetch('https://api.twitter.com/2/users/261546340/tweets', { 
                //     method: 'get', 
                //     headers:{'Authorization': `Bearer ${config.BOTONEWSTWITTERTOKEN}`}
                //     })
                //     .then(res => res.json())
                //     .then(body => {

                //         for (let i = 0; i != 3; i++) {
                //             tweetshipster = tweetshipster + `[${body.data[i].text}](https://twitter.com/hipsterhacker/status/${body.data[i].id})\n\n===================\n\n`
                //         }
                //     })

                fetchtweets("2317524115", "php_ceo").then(function(result) {
                    tweetsphp = tweetsphp + result
                })

                // fetch('https://api.twitter.com/2/users/2317524115/tweets', { 
                //     method: 'get', 
                //     headers:{'Authorization': `Bearer ${config.BOTONEWSTWITTERTOKEN}`}
                //     })
                //     .then(res => res.json())
                //     .then(body => {

                //         for (let i = 0; i != 3; i++) {
                //             tweetsphp = tweetsphp + `[${body.data[i].text}](https://twitter.com/php_ceo/status/${body.data[i].id})\n\n===================\n\n`
                //         }
                //     })
                    
                    sleep(1000).then(() => {
                        ctx.telegram.sendMessage(ctx.message.chat.id, `${tweetsneckbeard}${tweetshipster}${tweetsphp}`, { parse_mode: 'Markdown' })
                      });
                    tweetsphp = `[@php_ceo](https://twitter.com/php_ceo) last tweets :\n\n\n`
                    tweetsneckbeard = `[@neckbeardhacker](https://twitter.com/NeckbeardHacker) last tweets :\n\n\n`
                    tweetshipster = `[@hispterhacker](https://twitter.com/hipsterhacker) last tweets :\n\n\n`
                      
                fetch('https://actu.epfl.ch/api/v1/channels/1/news/?lang=en', {
                    method: 'get',
                })
                .then(res => res.json())
                .then(body => {
                    for (let i = 0; i != 3; i++) {
                        newsepfl = newsepfl + `[${body.results[i].title}](${body.results[i].news_url})\n\n`
                    }
                })
                    sleep(1000).then(() => {
                        ctx.telegram.sendMessage(ctx.message.chat.id, `${newsepfl}`, { parse_mode: 'Markdown' })
                    });
                    newsepfl = `Les dernières news de l'EPFL\n\n`
                })
        })
    })

bot.launch();

