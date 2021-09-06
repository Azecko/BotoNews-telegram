const fetch = require("node-fetch")

module.exports = async function fetchactu() {
    const response = await fetch(`https://actu.epfl.ch/api/v1/channels/1/news/?lang=en`);
    const body = await response.json();

    let data  = ""
    for (let i = 0; i != 3; i++) {
        data = data + `[${body.results[i].title}](${body.results[i].news_url})\n\n`
    }
    return data
}