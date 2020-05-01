const path = require("path")
const DAL = require(path.resolve("dal.js"))

exports.run = (client, message, args) => {
    
    let playlist_id = undefined;
    let song_id     = undefined;

    if(args.length < 2) {
        return message.channel.send("Invalid use of playlist remove")
    } else if(args.length == 2) {
        if(DAL.isInt(args[0])) {
            playlist_id = args[0];
        } else {
            let {err, playlist} = DAL.findPlaylistByName(args[0]);
            if(err) {
                return message.channel.send("There was an error while searching for a playlist by that name.")
            } else if(playlist === undefined) {
                return message.channel.send("There is no playlist by that name.")
            } else {
                playlist_id = playlist.playlist_id;
            }
        }
        if(DAL.isInt(args[1])) {
            song_id = args[1];
        } else {
            let {err, song} = DAL.findSongByName(args[1]);
            if(err) {
                return message.channel.send("There was an error while searching for a song by that name.")
            } else if(song === undefined) {
                return message.channel.send("There is no song by that name.")
            } else {
                song_id = song.song_id;
            }
        }
    } else { //More than 2 args, means we need to rely on the | split between playlist identifier and song identifier
        if((args.join(" ").match(/\|/g) || []).length !== 1) {
            return message.channel.send("The playlist identifier and song identifier must be seperated by a single |.")
        } else {
            let split_on_pipe = args.join(" ").split("|");
            let playlist_identifier = split_on_pipe[0].trim();
            let song_identifier = split_on_pipe[1].trim();
            
            if(DAL.isInt(playlist_identifier)) {
                playlist_id = playlist_identifier;
            } else {
                let {err, playlist} = DAL.findPlaylistByName(playlist_identifier);
                if(err) {
                    return message.channel.send("There was an error while searching for a playlist by that name.")
                } else if(playlist === undefined) {
                    return message.channel.send("There is no playlist by that name.")
                } else {
                    playlist_id = playlist.playlist_id;
                }
            }

            if(DAL.isInt(song_identifier)) {
                song_id = song_identifier;
            } else {
                let {err2, song} = DAL.findSongByName(song_identifier);
                if(err2) {
                    return message.channel.send("There was an error while searching for a song by that name.")
                } else if(song === undefined) {
                    return message.channel.send("There is no song by that name.")
                } else {
                    song_id = song.song_id;
                }
            }
        }
    }

    if(playlist_id === undefined || song_id === undefined) {
        //This shouldnt be possible by here, but just in ase
        message.channel.send(`There was an error that shouldnt be possible!`);
    } else {
        let {err, info} = DAL.removeFromPlaylist(playlist_id, song_id);
        if(err) {
            console.log(err);
            message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
        } else if (info.changes == 0) {
            message.channel.send(`That song wasn't on that playlist.`);
        } else {
            message.channel.send(`That song has been removed from that playlist.`);
        }
    }

    
};

exports.help = () =>{
    return "Remove a song from your playlist.";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "playlists",
        parent: "playlist",
        full_command: "playlist remove",
        command: "remove",
        description: "Remove a song from a playlist.  If the song occurs more than once, the last occurence is removed.",
        syntax: "playlist remove [playlist_identifier] | [song_identifier]",
        examples: [
            {
                description: "Remove song 'Goo' from playlist, 'Viscera'.",
                code: "playlist remove Viscera | Goo"
            },
            {
                description: "Play playlist, 5 by id.",
                code: "playlist play 5"
            }
        ]
    }
    return docs;
};