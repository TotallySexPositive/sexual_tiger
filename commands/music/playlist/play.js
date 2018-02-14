//Make playlist play index based instead of shift, repeast resets index at end of queue
const path  = require("path")
const fs    = require('fs');
const DAL   = require(path.resolve("dal.js"))


function playAudio(connection, message) {
    var server = global.servers[message.guild.id];

    if (server.dispatcher) {
        server.dispatcher.end("Fuckoff")
    }
    if (connection.status == 4) { //4 = dead connection
        let vc = message.member.voiceChannel
        vc.join()
        .then(connection => {
            playAudio(connection, message)
        })
        .catch(console.error);
        return
    } else { 
        dispatcher          = connection.playFile(path.resolve("hashed_audio", `${server.current_song.hash_id}.mp3`), {volume: server.volume})
        server.dispatcher   = dispatcher
    }

    dispatcher.on('end', (m) => {
        // The song has finished
        if(server.current_song_index < server.songs.length - 1 && m !== "Fuckoff") {//More songs to play and I am not being kicked off my another audio dispatcher
            server.current_song_index = server.current_song_index + 1;
            server.current_song = server.songs[server.current_song_index];
            playAudio(connection, message);
        } else { //End of the line?
            
            if(server.repeat && m !== "Fuckoff") { //Just kidding, restart. and I am not being kicked off my another audio dispatcher
                
                server.current_song_index = 0;
                server.current_song = server.songs[server.current_song_index];
                playAudio(connection, message);
            } else {
                
                if(!server.maintain_presence && m !== "Fuckoff") {//Fuckoff means we have more media incoming, dont kill connection.
                    connection.disconnect();
                } 
            }
        }
    });
    
    dispatcher.on('error', e => {
        // Catch any errors that may arise
        console.log(e);
        if(message.guild.voiceConnection)
        message.guild.voiceConnection.disconnect();
        message.channel.send("all fuck, it broke!");
    });
}

exports.run = (client, message, args) => {
    let vc = message.member.voiceChannel
    let server_id = message.guild.id;

    if(vc === undefined){
        return message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
    }
    
    if(!global.servers[server_id]) global.servers[server_id] = {
        playlist: {},
        current_song: {},
        current_song_index: -1,
        songs: []
    }

    let server = global.servers[server_id];
    let playlist = {};
    let pl_songs = [];

    let playlist_identifier = args.join(" ");
    if(DAL.isInt(playlist_identifier)) {//Got an int id
        let {err, songs} = DAL.getSongsByPlaylistId(playlist_identifier)
        if(err) {
            return message.channel.send("Unknown error occured while fetching playlist songs.");
        } else if(songs === undefined) {
            return message.channel.send("This playlist has no songs, you suck as a DJ.")
        } else {
            pl_songs = songs;
        }
    } else {//Got a playlist name
        let {err, songs} = DAL.getSongsByPlaylistName(playlist_identifier)
        if(err) {
            return message.channel.send("Unknown error occured while fetching playlist songs.");
        } else if(songs === undefined) {
            return message.channel.send("This playlist has no gets, you suck as a DJ.")
        } else {
            pl_songs = songs;
        }
    }
    
    server.songs = pl_songs;
    server.current_song_index = 0;
    server.current_song = pl_songs[server.current_song_index];

    vc.join().then(connection => {
        playAudio(connection, message);
    })
    .catch(console.error);
}

exports.help = () =>{
    return "Will play a playlist. (But not to no-one, he's weird)";
};