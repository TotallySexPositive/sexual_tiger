//Make playlist play index based instead of shift, repeast resets index at end of queue
const path  = require("path")
const fs    = require('fs');
const DAL   = require(path.resolve("dal.js"))
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('playlist_play').startTimer()
    var server  = global.servers[message.guild.id]
    let vc      = message.member.voice.channel

    if(vc === null) {
        return message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
    }

    let playlist_identifier = args.join(" ");
    let {err, songs} = DAL.getSongsByPlaylistIdentifier(playlist_identifier)

    if(err) {
        return message.channel.send("Unknown error occured while fetching playlist songs.");
    } else if(songs === undefined || songs.length == 0) {
        return message.channel.send("This playlist has no songs, you suck as a DJ.")
    }
    
    server.song_queue = songs;
    UTIL.playAudio(vc)
    end()
}

exports.help = () =>{
    return "Will play a playlist. (But not to no-one, he's weird)";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "playlists",
        parent: "playlist",
        full_command: "playlist play",
        command: "play",
        description: "Play a playlist by identifier",
        syntax: "playlist play [playlist_identifier]",
        examples: [
            {
                description: "Play playlist, 'Viscera' by name.",
                code: "playlist play Viscera"
            },
            {
                description: "Play playlist, 5 by id.",
                code: "playlist play 5"
            }
        ]
    }
    return docs;
};