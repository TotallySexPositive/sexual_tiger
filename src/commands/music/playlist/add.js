const path      = require("path")
import * as DAL from "../../../dal";
const parser    = require('yargs-parser')

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('playlist_add').startTimer()
    var opts = {
        alias: {
            playlist: ['p'],
            song: ['s'],
        },
        configuration: {
            'short-option-groups': false
          }
    }

    let arg_string = message.content.slice(13); //Chop off $playlist add
    var argv = parser(arg_string.replace(/= +/g, "="), opts)

    if(!argv.s || !argv.p) {
        return message.channel.send('You must provide a playlist and at least 1 song.  IDs or complete names are acceptable.  EX: $playlist add -p 3 -s "Drop the Ball"')
    }

    //Process/verify playlist
    if(Array.isArray(argv.p)) return message.channel.send("You must specify only a single playlist.");

    let {err:p_err, playlist}   = DAL.findPlaylistByIdentifier(argv.p)
    if(p_err) return message.channel.send(`Oops, issue trying to find the specified playlist, ${p_err.message}`);
    if(playlist === undefined) return message.channel.send(`The specified playlist doesnt exist.`);

    //Process/verify songs
    let song_identifiers = [];
    if(Array.isArray(argv.s)) {
        song_identifiers = argv.s
    } else {
        song_identifiers.push(argv.s);
    }

    let skipped_songs = [];
    let added_songs = [];

    song_identifiers.forEach((identifier) => {
        let {err:s_err, song}       = DAL.findSongByIdentifier(identifier)

        if(s_err) {
            skipped_songs.push(`X_X: ${identifier}`);
            console.log(s_rr);
        } else if(song === undefined) {
            skipped_songs.push(`DNE: ${identifier}`);
        } else {
            let {err, info} = DAL.addToPlaylist(playlist.playlist_id, song.song_id);
            if(err) {
                console.log(err);
                skipped_songs.push(`X_X: ${song.song_id}: ${song.name}`);
            } else {
                added_songs.push(`${song.name}`);
            }
        }
    });

    if(added_songs.length) {
        message.channel.send(`The following songs were added to **${playlist.name}**:\n${added_songs.join('\n')}`)
    }
    if(skipped_songs.length) {
        message.channel.send(`The following songs either didnt exist or crashed the query and were not add:\n${skipped_songs.join('\n')}`)
    }
    end()
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "playlists",
        parent: "playlist",
        full_command: "playlist add",
        command: "add",
        description: "Add a song(s) to a playlist.",
        syntax: "playlist add -p [playlist_id] -s [song_id]",
        examples: [
            {
                description: "Add one song to a playlist.",
                code: "playlist add -p 2 -s 74"
            },
            {
                description: "Add more than one song to a playlist.",
                code: "playlist add -p 2 -s 74 -s 66 -s 12"
            }
        ]
    }
    return docs;
};