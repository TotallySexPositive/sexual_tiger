const path      = require("path")
const fs        = require('fs');
const shuffle   = require('array-shuffle');
import * as DAL from "../../dal";
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    var server  = global.servers[message.guild.id]
    let vc      = message.member.voice.channel
    let playlist_identifier = args.join(" ");

    if(vc === null) {
        return message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
    }

    if(args.length <= 0) { //Just shuffle the current song queue
        server.song_queue = shuffle(server.song_queue)
        return message.channel.send("Shuffled the remaining songs in the queue.")
    } else { //Try and set the song_queue to the playlist specified and shuffle it.
        let {err, songs} = DAL.getSongsByPlaylistIdentifier(playlist_identifier)

        if(err) {
            return message.channel.send("Unknown error occured while fetching playlist songs.");
        } else if(songs === undefined || songs.length == 0) {
            return message.channel.send("This playlist has no songs, you suck as a DJ.")
        }
        
        server.song_queue = shuffle(songs);
        UTIL.playAudio(vc)
    }

}

exports.help = () => {
    return "Shuffle the current song queue or replace the song queue with a shuffled playlist.";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: "",
        full_command: "shuffle",
        command: "shuffle",
        description: "Shuffle the current song queue or replace the song queue with a shuffled playlist.",
        syntax: "shuffle [playlist_identifier]",
        examples: [
            {
                description: "Shuffle the remaining songs in the queue.",
                code: "shuffle"
            },
            {
                description: "Replace the current song queue with a shuffled playlist 14.",
                code: "shuffle 14"
            },
            {
                description: "Replace the current song queue with a shuffled playlist viscera.",
                code: "shuffle viscera"
            }
        ]
    }
    return docs;
};