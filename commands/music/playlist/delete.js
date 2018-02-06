const path = require("path")
const DAL = require(path.resolve("dal.js"))

exports.run = (client, message, args) => {
    
    var identifier  = args.join(" ");

    if(DAL.isInt(identifier)) {
        var {err, info} = DAL.deletePlaylistById(identifier);
    } else {
        var {err, info} = DAL.deletePlaylistByName(identifier);
    }
    
    if(err) {
        message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
    } else if (info.changes == 0) { 
        message.channel.send(`Sorry, ${message.author.username}, but that playlist didnt exist.`);
    } else {
        message.channel.send(`The playlist ${identifiername} has been deleted, You're DJ carrer is over, ${message.author.username}!`);
    }
};