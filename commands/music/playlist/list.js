const path = require("path")
const DAL = require(path.resolve("dal.js"))
const asciitable = require("asciitable")

exports.run = (client, message, args) => {
    var playlists_options = {
        skinny: true,
        intersectionCharacter: "+",
        columns: [
            {field: "playlist_id",  name: "ID"},
            {field: "name",         name: "Name"},
            {field: "num_songs",    name: "# Songs"}
        ],
    };

    var songs_options = {
        skinny: true,
        intersectionCharacter: "+",
        columns: [
            {field: "song_id",   name: "ID"},
            {field: "name",      name: "Name"},
            {field: "num_plays", name: "plays"}
        ],
    };

    if(!args.length) { //No args, show playlists
        let {err, playlists} = DAL.getPlaylists();

        if (err) { //Unhandled Error
            message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
        } else {
            let table = asciitable(playlists_options, playlists);
            message.channel.send(table, {code: true, split: true});
        }
    } else {
        let playlist_identifier = args.join(" ")
        let {err, songs} = DAL.getSongsByPlaylistIdentifier(playlist_identifier)
        if(err) {
            message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`)
        } else {
            let table = asciitable(songs_options, songs);
            message.channel.send(table, {code: true, split: true});
        }
    }
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "playlists",
        parent: "playlist",
        full_command: "playlist list",
        command: "list",
        description: "List all playlists",
        syntax: "playlist list",
        examples: [
            {
                description: "List playlists",
                code: "playlist list"
            }
        ]
    }
    return docs;
};