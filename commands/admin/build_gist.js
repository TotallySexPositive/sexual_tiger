const path  = require("path")
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    let err = UTIL.rebuildAudioGist();
    if(err) {
        message.channel.send(err.message);
    } else {
        message.channel.send("Updated!");
    }
}

exports.help = () =>{
    return "Rebuilds the Audio Gist on github from the current DB.";
};