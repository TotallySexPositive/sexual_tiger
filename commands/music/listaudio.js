const path      = require("path")
const fs        = require('fs');


exports.run = (client, message, args) => {
    let folder = "audio/"
    let files = []

    fs.readdirSync(folder).forEach(file => {
        files.push(file);
    });
    fs.readdirSync(folder + "music/").forEach(file => {
        files.push("music/" + file);
    });

    message.channel.send(files.join("\n"));
}

exports.help = () =>{
    return "List all audio files.";
};