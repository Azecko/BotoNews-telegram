const fetch = require("node-fetch")

module.exports = async function fetchhacker() {

    let data = ""

    const allnumbers = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty');
    const body = await allnumbers.json();

    for (let i = 0; i != 3; i++) {
        const three = await fetch(`https://hacker-news.firebaseio.com/v0/item/${body[i]}.json?print=pretty`)
        const threebody = await three.json()
        data = data + `[${threebody.title}](${threebody.url})\n\n`
    }

    return data
}
