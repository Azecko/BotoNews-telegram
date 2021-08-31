const { Telegraf } = require('telegraf')
const fetch = require('node-fetch');
const xml2js = require('xml2js');

const bot = new Telegraf(process.env.BOTONEWSTOKEN);

bot.launch();
