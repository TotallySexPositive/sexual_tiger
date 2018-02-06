const DAL = require("../dal.js")

exports.run = (client, message, args) => {
    
    var head = args[0];
    var terms = args.slice(1).join(" ");

    switch(head) {
        case "song_id":
            DAL.findSongById(terms, (err, song) =>{
                if(err) {
                    message.channel.send(`Query Failed. ${err.message}`)
                } else if(song === undefined) {
                    message.channel.send(`No song with that ID.`)
                } else {
                    message.channel.send(`Found Song: ${song.name}`)
                }
            });
            break;
        case "playlist_id":
            DAL.findPlaylistById(terms, (err, playlist) =>{
                if(err) {
                    message.channel.send("Query Failed.")
                } else if(playlist === undefined) {
                    message.channel.send(`No playlist with that ID.`)
                } else {
                    message.channel.send(`Found playlist: ${playlist.name}`)
                }
            });
            break;
        case "playlist_name":
            DAL.findPlaylistByName(terms, (err, playlist) =>{
                if(err) {
                    message.channel.send("Query Failed.")
                } else if(playlist === undefined) {
                    message.channel.send(`No playlist with that Name.`)
                } else {
                    message.channel.send(`Found playlist: ${playlist.playlist_id}`)
                }
            });
            break;
        case "playlist_songs_id":
            DAL.getSongsByPlaylistId(terms, (err, songs) =>{
                if(err) {
                    message.channel.send("Query Failed.")
                } else if(!songs.length) {
                    message.channel.send(`No Songs on playlist.`)
                } else {
                    message.channel.send(`Found Songs: ${songs}`)
                }
            });
            break;
        case "playlist_songs_name":
            DAL.getSongsByPlaylistName(terms, (err, songs) =>{
                if(err) {
                    message.channel.send("Query Failed.")
                } else if(!songs.length) {
                    message.channel.send(`No Songs on playlist.`)
                } else {
                    message.channel.send(`Found Songs: ${songs}`)
                }
            });
            break;
        default:
            message.channel.send("Invalid thingy passed.")
    }
};