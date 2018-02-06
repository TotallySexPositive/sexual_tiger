const path = require("path")
const DAL = require(path.resolve("dal.js"))
const asciitable = require("asciitable")

exports.run = (client, message, args) => {
    var options = {
        skinny: true,
        intersectionCharacter: "+",
        columns: [
            {field: "playlist_id",  name: "ID"},
            {field: "name",         name: "Name"},
            {field: "num_songs",    name: "# Songs"}
        ],
    };

    let {err, playlists} = DAL.getPlaylists();

    if (err) { //Unhandled Error
        message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
    } else {
        let table = asciitable(options, playlists);
        message.channel.send(table, {code: true, split: true});
    }
};