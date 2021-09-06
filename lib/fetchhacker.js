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

    // fetch('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty')
    // .then(res => res.json())
    // .then(body => {
    //     let data = ""
    //     for (let i = 0; i != 3; i++) {
    //         // console.log(body[i])
    //         fetch(`https://hacker-news.firebaseio.com/v0/item/${body[i]}.json?print=pretty`)
    //             .then(res => res.json())
    //             .then(body => {
    //                 data = data + `[${body.title}](${body.url})\n\n`
    //             })
    //     }
    //     console.log(data)
    //     return data
    // })
}
