const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))
const auth  = require(path.resolve('auth.json'));
var giphy   = require('giphy-api')(auth.giphy);

exports.run = (client, message, args) => {

    // Search with options using callback
    giphy.search({
        q: args.join(" "),
        limit: 1,
        offset: Math.floor(Math.random() * 200) + 1
    }, function (err, res) {
        if(err) {
            console.log(err);
            return message.channel.send("Error while searching for gif.")
        } else {
            console.log(res);
            if(res.data && res.data.images && res.data.images.original) {
                return message.channel.send(res.data.images.original.url);
            } else {
                return message.channel.send("Couldnt find anything with those tags.")
            }
        }
    });
}

exports.help = () =>{
    return "Grab random image from Giphy!";
};

exports.docs = () => {
    let docs = {
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "gif",
        command: "gif",
        description: "Grab a random image from Giphy with the specified tags, or completely random if no tags",
        syntax: 'gif [tags]',
        examples: [
            {
                description: "Post image of jumping",
                code: `gif jump`
            }
        ]
    }
    return docs;
};