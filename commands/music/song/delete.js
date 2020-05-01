const path  = require("path")
const DAL   = require(path.resolve("dal.js"))
const UTIL  = require(path.resolve("utils.js"))
const fs    = require('fs');

exports.run = (client, message, args) => {
    let server = global.servers[message.guild.id];
    var identifier  = args.join(" ");
    let playlist_id = undefined;

    let user_is_super_admin = server.super_admins.includes(message.author.id);
    if(!UTIL.isInt(identifier)) {
        return message.channel.send("Song can only be delete by ID herp derp...");
    }
  
    let {err, song} = DAL.findSongById(identifier);
    if(err) {
        console.log(err);
        return message.channel.send("Crashed while looking for that song, thanks alot.")
    } else if (song === undefined) {
        return message.channel.send("Thanks for wasting my time, there was not song by that id.");
    } else {
        if(message.author.id != song.added_by && !user_is_super_admin) { //Yell at the user for trying to delete other peoples stuff, unless this user is a super admin. (Adam/Steve)
            return message.channel.send("Hey, how about you dont be a twat and not try and delete other peoples uploads.")
        } else {
            let {err, info} = DAL.deleteSongById(song.song_id);
            if(err) {
                if(err.message.includes("FOREIGN KEY")) {
                    let {err: pl_err, playlists} = DAL.getPlaylistsWithSong(song.song_id);
                    if(pl_err) {
                        console.log(pl_err)
                        return message.channel.send("We couldnt delete that song because it is currently on at least one playlist.  But we crashed while retreiving those playlist.");
                    } else {
                        let playlists_str = "";
                        playlists.forEach((playlist) => {
                            playlists_str = playlists_str + `ID: ${playlist.playlist_id}    Name: ${playlist.name}\n`
                        })
                        return message.channel.send(`We couldnt delete that song because it is currently on the following playlist(s).\n\n${playlists_str}`);
                    }
                } else {
                    console.log(err);
                    return message.channel.send("We couldnt delete that song and have no idea why not.");
                }
            } else {
                let gist_err = UTIL.rebuildAudioGist();
                if(gist_err) {
                    console.log("Failed to update audio gist on song delete.")
                    console.log(gist_err);
                }
                let hashed_file = song.hash_id + ".mp3"
                let stored_file = song.source

                fs.unlink(path.resolve(global.audio_dirs.hashed, hashed_file), function(err3){
                    if(err3) {
                        console.log("Failed to delete requested hashed file.")
                        console.log(err3);
                    }
                });
                fs.unlink(path.resolve(global.audio_dirs.stored, stored_file), function(err3){
                    if(err3) {
                        console.log("Failed to delete requested stored file.")
                        console.log(err3);
                    }
                });
                return message.channel.send(`${song.name} has been delete from the database.`)
            }
        }
    }
};

exports.docs = () => {
    let docs = {
        default_access: 0,
        tab: "music",
        link: "song",
        parent: "song",
        full_command: "song delete",
        command: "delete",
        description: "Deletes a song from the database.  The song must not be on a playlist, and songs can only be deleted by the user that uploaded them.",
        syntax: "song delete",
        examples: [
            {
                description: "Delete song 66 from the DB.",
                code: "song delete 66"
            }
        ]
    }
    return docs;
};