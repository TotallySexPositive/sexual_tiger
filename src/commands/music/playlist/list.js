const path = require("path")
import * as DAL from "../../../dal";
import * as UTIL from "../../../utils";
const asciitable = require("asciitable")

exports.run = async (client, message, args) => {
    
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
            let chunks = UTIL.splitTable(table);
            for (let i = 0; i < chunks.length; i++) {
                await message.channel.send("```" + chunks[i] + "```");
            }
        }
    } else {
        let playlist_identifier = args.join(" ")
        let {err, songs} = DAL.getSongsByPlaylistIdentifier(playlist_identifier)
        if(err) {
            message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`)
        } else {
            let table = asciitable(songs_options, songs);
            let chunks = UTIL.splitTable(table);
            for (let i = 0; i < chunks.length; i++) {
                await message.channel.send("```" + chunks[i] + "```");
            }
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