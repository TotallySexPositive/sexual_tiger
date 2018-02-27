const path  = require("path");
const fs    = require("fs");
const DAL   = require(path.resolve("dal.js"))
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    if(args.length != 1) {
        message.channel.send("You must send only a single file hash. EX: $image delete 56a6aa2e7fb765c854215c89a7ff5ec1")
    } else {
        let hash = args[0]
        let {err, image} = UTIL.deleteImageByHash(message, hash);
        if(err) {
            message.channel.send(err.message);
        } else if (image === undefined) {
            message.channel.send("There was no image with that hash.")
        } else {
            message.channel.send(`Image: ${image.hash_id}${image.extension} has been deleted.`);
        }
    }
}

exports.help = () =>{
    return "Send an imagine into oblivion! $image delete [hash_id]";
};