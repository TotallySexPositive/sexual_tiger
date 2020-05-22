const path  = require("path")
import * as DAL from "../../../dal";


exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('playlist_queue').startTimer()
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
    
    server.song_queue = server.song_queue.concat(songs);
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
        full_command: "playlist queue",
        command: "queue",
        description: "Queue a playlist by identifier",
        syntax: "playlist queue [playlist_identifier]",
        examples: [
            {
                description: "Queue playlist, 'Viscera' by name.",
                code: "playlist queue Viscera"
            },
            {
                description: "Queue playlist, 5 by id.",
                code: "playlist queue 5"
            }
        ]
    }
    return docs;
};