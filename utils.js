"use strict";

const path      = require("path")
const fs        = require('fs');
const DAL       = require(path.resolve("dal.js"))
const md5       = require('md5');
const { exec }  = require('child_process');
const auth      = require(path.resolve("auth.json"));
const octokit   = require('@octokit/rest')();
const mdt       = require("markdown-table")
const probe     = require('node-ffprobe');

var isInt = function(value) {
    var er = /^-?[0-9]+$/;
    return er.test(value);
}

var playAudio = function(client, connection, message, song, callBack) {
    var server = global.servers[message.guild.id]
    let dispatcher = null;

    if (server.dispatcher) {
        server.dispatcher.end("remain")
    }
    if (connection.status == 4) { //4 = dead connection
        let vc = message.member.voiceChannel;
        vc.join()
        .then(connection => {
            playAudio(client, connection, message, song, callBack);
        })
        .catch(console.error);
        return;
    } else {         
        dispatcher = connection.playFile(path.resolve(global.audio_dirs.hashed, `${song.hash_id}.mp3`), {volume: server.volume});
        let {err, info} = DAL.incrementNumPlays(song.song_id);
        if(err) {
            console.log(err);
            console.log(`Failed to increment num_plays for song_id, ${song.song_id}`);
        } else if(info.changes <= 0) {
            console.log(`Failed to increment num_plays for song_id, ${song.song_id}`);
            console.log("The song_id didnt exist?");
        }
        server.dispatcher = dispatcher;
    }
    
    dispatcher.on('end', (m) => {
        // The song has finished
        callBack(client, connection, message, song, callBack, m);
    });

    dispatcher.on('error', e => {
        // Catch any errors that may arise
        console.log(e);
        message.channel.send("all fuck, it broke!");
        connection.disconnect()
    });
}

var playAudioBasicCallBack = function(client, connection, message, song, callBack, end_m) {
    let server = global.servers[message.guild.id];
    if (server.repeat && end_m !== "remain"){
        playAudio(client, connection, message, song, callBack); // play it again!
    } else {
        if(!server.maintain_presence && end_m !== "remain") {//Fuckoff means we have more media incoming, dont kill connection.
            connection.disconnect();
        }
    }
}

var playlistPlayBasicCallBack = function(client, connection, message, song, callBack, end_m) {
    let server = global.servers[message.guild.id];

    if(server.current_song_index < server.songs.length - 1 && end_m !== "remain") {//More songs to play and I am not being kicked off my another audio dispatcher
        server.current_song_index = server.current_song_index + 1;
        server.current_song = server.songs[server.current_song_index];
        playAudio(client, connection, message, server.current_song, callBack);
    } else { //End of the line?
        if(server.repeat && end_m !== "remain") { //Just kidding, restart. and I am not being kicked off my another audio dispatcher
            server.current_song_index = 0;
            server.current_song = server.songs[server.current_song_index];
            playAudio(client, connection, message, server.current_song, playlistPlayBasicCallBack);
        } else {
            if(!server.maintain_presence && end_m !== "remain") {//remain means we have more media incoming, dont kill connection.
                connection.disconnect();
            } 
        }
    }
}

var processAudioFileTask = function(t_obj, cb) {
    return processAudioFile(t_obj.file_path, t_obj.url, t_obj.message, cb)
}

var processAudioFile = function(file_path, url, message, cb) {
    let hashed_audio_path       = global.audio_dirs.hashed;
    let stored_audio_path       = global.audio_dirs.stored;
    console.log(`FP: ${file_path})`);

    let file_name               = path.basename(file_path);

    console.log(`Started Processing file, ${file_name}`)
    message.channel.send(`Starting to process file: ${file_name}, I'll let you know when its ready.`);

    let file_hash           = md5(fs.readFileSync(file_path));
    let cleaned_file_name   = file_name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").replace(/ +/g, " ") //Strip off extention, replace underscore and hypen with space, reduce more than 2 spaces to 1
    let new_file_name       = file_hash + ".mp3"
    
    let hashed_file_path    = path.resolve(hashed_audio_path, new_file_name);
    let stored_file_path    = path.resolve(stored_audio_path, `${cleaned_file_name}-${file_hash}`)

    let {err, song}         = DAL.findSongByHashId(file_hash);

    if(err) {
        console.log("Oops?");
        console.log(err);
    } else if (song !== undefined) {
        fs.unlink(file_path, function(err3) {
            if(err3) {
                console.log("Failed to delete duplicate file.")
                console.log(err3);
            }
        })
        cb(new Error(`The given file already exists on the server by name, ${song.name}`), undefined);
        return;
    }
        
    exec(`ffmpeg-normalize "${file_path}" -c:a libmp3lame -ofmt mp3 -ext mp3 -o ${hashed_file_path} -f -t -20`, (err, stdout, stderr) => {
        if (err) {// node couldn't execute the command
            if(err.message.indexOf("Invalid data found") == -1) { //Only output error if we dont know why it happened.
                console.log("Couldnt run command");
                console.log(err);
            } 
            fs.unlink(file_path, function(err3){
                if(err3) {
                    console.log(`Failed to Deleted offending file. ${file_path}`)
                    console.log(err3);
                } else {
                    console.log(`Deleted offending file. ${file_path}`);
                    message.channel.send("I dont know what the fuck you just tried to be me to process, but I deleted it. :stuck_out_tongue: ")

                }
            })
            cb(new Error(`Failed to run ffmpeg-normalize. ${err.message}`), undefined);
        } else {
            let {err, info} = DAL.insertIntoSongs(file_hash, cleaned_file_name, stored_file_path, url, message.author.id);
            
            if(err) {
                console.log(err);
                cb(new Error(`Failed to run insert song into DB. ${err.message}`), undefined);
            } else {
                probe_audio_file(file_hash);

                let gist_err = rebuildAudioGist();
                if(gist_err) {
                    console.log(gist_err);
                    message.channel.send("Tell Adam the gist list bit the bullet.");
                }
                fs.rename(file_path, stored_file_path, (err) => {
                    if(err) {
                        console.log(`Failed to move file, ${file_path} to ${stored_file_path}`);
                        console.log(err);
                    }
                })
                cb(undefined, `The song ${cleaned_file_name} has been added, You're the DJ ${message.author.username}!`);
            }
        }
    });
}

var processImageFile = function(file_path, tag_name, message) {
    let hashed_image_path       = global.image_dirs.hashed;
    let file_name               = path.basename(file_path);
    let ext                     = path.extname(file_path).replace(/\?.*$/, "");
    let tag_id                  = -1;

    if(ext === "" || ext === "." || ext.length > 5) ext = ".gif";


    let file_hash           = md5(fs.readFileSync(file_path));
    let new_file_name       = file_hash + ext
    let hashed_file_path    = path.resolve(hashed_image_path, new_file_name);

    let {err, image}        = DAL.findImageByHashId(file_hash);

    if(err) {
        console.log("Oops?");
        console.log(err);
    } else if (image !== undefined) {
        fs.unlink(file_path, function(err3) {
            if(err3) {
                console.log("Failed to delete duplicate file.")
                console.log(err3);
            }
        });
        return new Error(`That file already exists on the server by the name`);
    }


    let {err:t_err, tag} = DAL.findTagByName(tag_name);
    if(t_err) {
        return new Error('Crashed finding Tag with that name.')
    } else if(tag === undefined) { //No tag with that name exists
        let {err:nt_err, info} = DAL.insertIntoTag(tag_name);
        {
            if(nt_err) {
                return new Error('Crashed while trying to create new Tag');
            } else {
                tag_id = info.lastInsertROWID;
            }
        }
    } else {
        tag_id = tag.tag_id;
    }
 
    let {err: err_i, info} = DAL.insertIntoImages(file_hash, ext, message.author.id);
    
    if(err_i) {
        console.log(err_i);
        return new Error(`Error while inserting image.`);
    } else {
        fs.rename(file_path, hashed_file_path, (err) => {
            if(err) {
                console.log(`Failed to move file, ${file_path} to ${hashed_file_path}`);
                console.log(err);
            }
        });
        let {err: it_err, info:it_info} = DAL.insertIntoImageTag(info.lastInsertROWID, tag_id);
        if(it_err) {
            return Error(`Failed to create relationship between Image: ${info.lastInsertROWID} and Tag: ${tag_id}`)
        }
    }
}

let probe_audio_file = function(file_hash) {
    probe(path.resolve(global.audio_dirs.hashed, file_hash + ".mp3"), function(err, data) {
        let {err: s_err, song} = DAL.findSongByIdentifier(file_hash)
        if(s_err) {
            console.log("Probe Audio File: Uh oh...");
            console.log(file_hash);
        } else {
            song.duration = Math.ceil(data.streams[0].duration);
            if(song.duration > 30) {
                song.is_clip = 1;
            } else {
                song.is_clip = 0;
            }

            DAL.updateSong(song);
        }
    });
}

let pareKyubeyImages = function(message) {

}

//Yeah its fucking inefficient but.... fuck you
let rebuildAudioGist = function() {
    let {err, songs} = DAL.getAllSongs();

    if(err) {
        return new Error("Failed to grab all songs to build the list");
    } else {
        try {
            octokit.authenticate({
                type: 'token',
                token: auth.github_token
            });
        
            let table = [];
            table.push(["ID", "Song"])
            songs.forEach((song) => {
                table.push([song.song_id, song.name])
            });
    
            let payload = {};
            payload.id = "c76103763a2f785162d30c841094e795";
            payload.description = "All the audio files avaiable to play."
            payload.files = {
                "Audio.md": {
                    content: mdt(table)
                }
            };
            
            octokit.gists.edit(payload, (error, result) => {
                if(error) {
                    console.log(error);
                    return new Error("rebuildAudioGist error'd out while PUTing gist.")
                } else {
                    return undefined;
                }
            });

        } catch (err) {
            return new Error("Something error'd out while rebuilding Gist.")
        }
    }
}


let getFileSizeInMegaBytes = function(file) {
    const stats = fs.statSync(file)
    const file_size_in_bytes = stats.size
    const file_size_in_mb = file_size_in_bytes / 1000000.0
    return file_size_in_mb;
}

module.exports.isInt = isInt;
module.exports.playAudio = playAudio;
module.exports.playAudioBasicCallBack = playAudioBasicCallBack;
module.exports.playlistPlayBasicCallBack = playlistPlayBasicCallBack;
module.exports.processAudioFile = processAudioFile;
module.exports.rebuildAudioGist = rebuildAudioGist;
module.exports.pareKyubeyImages = pareKyubeyImages;
module.exports.processImageFile = processImageFile;
module.exports.getFileSizeInMegaBytes = getFileSizeInMegaBytes;
module.exports.processAudioFileTask = processAudioFileTask;
