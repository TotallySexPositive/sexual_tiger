const path = require("path")
const DAL = require(path.resolve("dal.js"))

exports.run = (client, message, args) => {
    
    var identifier  = args.join(" ");
    let playlist_id = undefined;

    if(DAL.isInt(identifier)) { //Identifier is an integer, so it must be an id
        playlist_id = identifier;
    } else { //Identifier is not an Integer, so it must be the name of a playlist, lets find it.
        var {err, playlist} = DAL.findPlaylistByName(identifier);
        if(err) {
            return message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
        } else if(playlist === undefined) {
            return message.channel.send(`Sorry, ${message.author.username}, a playlist with that name doesnt exist.`);
        } else {
            playlist_id = playlist.playlist_id;
        }
    }

    var {err, info} = DAL.deletePlaylistById(playlist_id);
    
    if(err) {
        message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
    } else if (info.changes == 0) { 
        message.channel.send(`Sorry, ${message.author.username}, but that playlist didnt exist.`);
    } else {
        message.channel.send(`The playlist ${identifier} has been deleted, You're DJ career is over, ${message.author.username}!`);
    }
};