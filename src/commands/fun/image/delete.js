/*const path  = require("path");
const fs    = require("fs");
import * as DAL from "./dal";
import * as UTIL from "./utils.js";

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

exports.docs = () => {
    let docs = {
        tab: "image",
        link: "image",
        parent: "image",
        full_command: "image delete",
        command: "delete",
        description: "Delete an image from the database.  This will completely delete an image.  If an image is just tagged wrong please use 'image untag' instead of delete.  In order to ",
        syntax: 'image delete [post_id]',
        examples: [
            {
                description: "Add the image 'coolimage.jpg' to the bot and tag it as flex",
                code: `image add http://coolimages.com/coolimage.jpg flex`
            },
            {
                description: "Add the image 'coolimage.jpg' to the bot and tag it as clap, slap, flip",
                code: `image add http://coolimages.com/coolimage.jpg clap slap flip`
            }
        ]
    }
    return docs;
};*/