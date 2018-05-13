const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))
const auth  = require(path.resolve('auth.json'));
var giphy   = require('giphy-api')(auth.giphy);

exports.run = (client, message, args) => {

    if(args.length){
        giphy.search({
            q: args.join(" "),
            limit: 1,
            offset: Math.floor(Math.random() * 200) + 1
        }, function (err, res) {
            if(err) {
                console.log(err);
                return message.channel.send("Error while searching for gif.")
            } else {
                if(res.data && res.data.length ) {
                    return message.channel.send(res.data[0].url);
                } else {
                    return message.channel.send("Couldnt find anything with those terms.")
                }
            }
        });
    } else {
        return message.channel.send("You have to search for something.")
    }
    
}

exports.help = () =>{
    return "Grab random image from Giphy!";
};

exports.docs = () => {
    let docs = {
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "gifs",
        command: "gifs",
        description: "Grab a random image from Giphy with the requested search terms",
        syntax: 'gifs [words to search]',
        examples: [
            {
                description: "Post image of jumping",
                code: `gifs jump`
            }
        ]
    }
    return docs;
};