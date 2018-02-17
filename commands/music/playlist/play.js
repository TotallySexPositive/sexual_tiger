//Make playlist play index based instead of shift, repeast resets index at end of queue
const path  = require("path")
const fs    = require('fs');
const DAL   = require(path.resolve("dal.js"))
const UTIL  = require(path.resolve("utils.js"))

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
    //server.current_playlist = ;

    vc.join().then(connection => {
        UTIL.playAudio(client, connection, message, server.current_song, UTIL.playlistPlayBasicCallBack);
    })
    .catch(console.error);
}

exports.help = () =>{
    return "Will play a playlist. (But not to no-one, he's weird)";
};