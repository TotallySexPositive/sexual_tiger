const path      = require("path")
const fs        = require('fs');
const shuffle   = require('array-shuffle');

exports.run = (client, message, args) => {
    let server = global.servers[message.guild.id];

    if(server.songs.length > 0 && server.dispatcher) {
        server.songs                = shuffle(server.songs);
        server.current_song_index   = -1; //-1 because the callback on dispatcher(end) will increment it back to 0.
        server.current_song         = server.songs[server.current_song_index+1]; //+1 because we -1 it before
        server.dispatcher.end(); //Trigger end event on dispatcher.  this should trigger it to restart the shuffled version.  This is also where +1 will happen to get current_song_index back to 0
        message.channel.send("Restarting shuffled playlist.")
    } else {
        message.channel.send("Nothing to Shuffle?")
    }
}

exports.help = () => {
    return "Shuffles the order of songs in the playlist for the current play through, also restarts the playlist.";
};

exports.docs = () => {
    let docs = {
        tab: "music",
        link: "playlists",
        parent: "playlist",
        full_command: "playlist shuffle",
        command: "shuffle",
        description: "Shuffle the currently playing playlist.",
        syntax: "playlist shuffle",
        examples: [
            {
                description: "Shuffle the currently playing playlist",
                code: "playlist shuffle"
            }
        ]
    }
    return docs;
};