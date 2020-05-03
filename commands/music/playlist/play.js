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
        } else if(songs === undefined || songs.length == 0) {
            return message.channel.send("This playlist has no songs, you suck as a DJ.")
        } else {
            pl_songs = songs;
        }
    } else {//Got a playlist name
        let {err, songs} = DAL.getSongsByPlaylistName(playlist_identifier)
        if(err) {
            return message.channel.send("Unknown error occured while fetching playlist songs.");
        } else if(songs === undefined || songs.length == 0) {
            return message.channel.send("This playlist has no songs, you suck as a DJ.")
        } else {
            pl_songs = songs;
        }
    }
    
    server.song_queue.length = 0;
    songs.forEach(song =>{
        let song_request = {
            voice_channel: vc,
            song: song
        }
        server.song_queue.push(song_request);
    });
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