const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))
const auth  = require(path.resolve('auth.json'));
var giphy   = require('giphy-api')(auth.giphy);

exports.run = (client, message, args) => {
    giphy.random(args.join(" "), function (err, res) {
        if(err) {
            console.log(err);
            return message.channel.send("Error while searching for gif.")
        } else {
            return message.channel.send(res.data.images.original.url);
        }
    });	
}

exports.help = () =>{
    return "Give me an A!";
};

exports.docs = () => {
    let docs = {
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "cheer",
        command: "cheer",
        description: "Post an image of anime cheer.",
        syntax: 'cheer',
        examples: [
            {
                description: "Post image of cheer",
                code: `cheer`
            }
        ]
    }
    return docs;
};