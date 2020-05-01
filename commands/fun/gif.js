const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))
const auth  = require(path.resolve('auth.json'));
var giphy   = require('giphy-api')(auth.giphy);
var request = require("request")

exports.run = (client, message, args) => {
    giphy.random(args.join(" "), function (err, res) {
        if(err) {
            console.log(err);
            return message.channel.send("Error while searching for gif.")
        } else {
            if(res.data && res.data.images && res.data.image_original_url) {
                request.head({
                    url: res.data.image_original_url,
                    method: "HEAD"
                }, function(err, response, body) {
                    let bytes = response.headers["content-length"];
                    if (bytes <= 8388119) {
                        return message.channel.send({files: [res.data.image_original_url]});
                    } else {
                        return message.channel.send(res.data.image_original_url);
                    }
                });
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
        default_access: 1,
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