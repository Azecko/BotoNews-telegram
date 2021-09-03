const fetch = require("node-fetch")
const config = require("../config.json")

module.exports = async function fetchtweets(userid, username) {
    
    return await fetch(`https://api.twitter.com/2/users/${userid}/tweets`, { 
        method: 'get', 
        headers:{'Authorization': `Bearer ${config.BOTONEWSTWITTERTOKEN}`}
        })
        .then(res => res.json())
        .then(body => {
            let data = ""
            for (let i = 0; i != 3; i++) {
                data = data +`[${body.data[i].text}](https://twitter.com/${username}/status/${body.data[i].id})\n\n===================\n\n`
            }
            //console.log(data)
            return data
        })

}