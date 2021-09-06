const fetch = require("node-fetch")
const parser = require("fast-xml-parser")

module.exports = async function fetchgo() {

    // 1. get data with fetch on go's feed
    const response = await fetch('https://go.epfl.ch/feed');
    const body = await response.text();

    // 2. process data with xml2js
    var jsonObj = parser.parse(body)

    let data  = ""
    for (let i = 0; i != 3; i++) {
        data = data + `${jsonObj.feed.entry[i].title}\n\n`
    }
    return data
}
