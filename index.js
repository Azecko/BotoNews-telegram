const { Telegraf } = require('telegraf')
const fetch = require('node-fetch');
const xml2js = require('xml2js');
const config = require("./config.json")

var fetchtweets = require("./lib/fetchtweets.js")
var fetchgo = require("./lib/fetchgo.js")

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
var messages = `Les derniers liens raccourcis sur go.epfl.ch\n\n`

bot.command('getfeed', async (ctx) => {
    
            let godata = await fetchgo()
            messages = messages + godata
            sleep(1000).then(() => {
                ctx.telegram.sendMessage(ctx.message.chat.id, `${messages}`, { parse_mode: 'Markdown' })
            });

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

                fetchtweets("278523798", "neckbeardhacker").then(function(result) {
                    tweetsneckbeard = tweetsneckbeard + result
                })

                fetchtweets("261546340", "hipsterhacker").then(function(result) {
                    tweetshipster = tweetshipster + result
                })

                fetchtweets("2317524115", "php_ceo").then(function(result) {
                    tweetsphp = tweetsphp + result
                })
                    
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

bot.launch();

