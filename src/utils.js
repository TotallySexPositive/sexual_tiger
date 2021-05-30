"use strict";

const path      = require("path")
const fs        = require('fs');
import * as DAL from "./dal";
const md5       = require('md5');
const { exec }  = require('child_process');
const auth      = require(path.resolve("auth.json"));
const { Octokit } = require("@octokit/rest");
const mdt       = require("markdown-table")
const probe     = require('node-ffprobe');
const recursive     = require("recursive-readdir");
const Permissions = require("discord.js").Permissions

var isInt = function(value) {
    var er = /^-?[0-9]+$/;
    return er.test(value);
}

var isAdmin = function(member) {
    return member.hasPermission(Permissions.FLAGS.ADMINISTRATOR)
}

var playAudio = async function(voice_channel) {
    let server_id   = voice_channel.guild.id
    let server      = global.servers[server_id]

    server.connectionPromise    = voice_channel.join()

    //If there is a song playing, replay it. If not grab the first one off the list.

    if (!server.repeat || !server.current_song){
        server.current_song = server.song_queue.shift()
    } else {
        //A song is already playing, just leave current song alone, it will repeat.
    }

    let volume                  = server.current_song && server.current_song.is_clip ? server.clip_volume : server.volume

    server.connectionPromise.then(connection => {
        let dispatcher  = connection.play(path.resolve(global.audio_dirs.hashed, `${server.current_song.hash_id}.mp3`), {volume: 1 })

        dispatcher.setVolume(volume)

        dispatcher.on('start',() => {
            DAL.incrementNumPlays(server.current_song.song_id)
        })

        dispatcher.on('finish', () => {
            if (server.song_queue.length !== 0 || server.repeat) {
                playAudio(voice_channel)
            } else if(!server.maintain_presence) {
                server.current_song = undefined
                connection.disconnect()
            }
        })
    }).catch(reason => {
        console.log(reason)
    })
}

var playUrl = function (url, voice_channel) {
    const server = global.servers[voice_channel.guild.id];
    server.connectionPromise    = voice_channel.join()

    server.connectionPromise.then(connection => {
        let dispatcher  = connection.play(url, {volume: 1});
        dispatcher.setVolume(server.clip_volume)

        dispatcher.on('finish', () => {
            if(!server.maintain_presence) {
                server.current_song = undefined
                connection.disconnect()
            }
        })
    }).catch(reason => {
        console.log(reason)
    });
};

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
        
    exec(`nice ffmpeg-normalize "${file_path}" -c:a libmp3lame -ofmt mp3 -ext mp3 -o ${hashed_file_path} -f -t -20`, (err, stdout, stderr) => {
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
                    message.channel.send("I dont know what the fuck you just tried to get me to process, but I deleted it. :stuck_out_tongue: ")
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

                let err = generateAudioList();
                if(err) {
                    message.channel.send("Failed to update audio list after adding a new song.");
                    message.channel.send(err.message);
                }
                fs.rename(file_path, stored_file_path, (err) => {
                    if(err) {
                        console.log(`Failed to move file, ${file_path} to ${stored_file_path}`);
                        console.log(err);
                    }
                })
                cb(undefined, `The song ID: ${info.lastInsertRowid}  Name: ${cleaned_file_name} has been added, You're the DJ ${message.author.username}!`);
            }
        }
    });
}

var processImageFile = function(file_path, tag_names, user_id) {
    let hashed_image_path       = global.image_dirs.hashed;
    let file_name               = path.basename(file_path);
    let ext                     = path.extname(file_path).replace(/\?.*$/, "");
    let tag_id                  = -1;

    if(ext === "" || ext === "." || ext.length > 5) ext = ".gif";

    let file_hash           = md5(fs.readFileSync(file_path));
    let new_file_name       = file_hash + ext
    let hashed_file_path    = path.resolve(hashed_image_path, new_file_name);

    //Check if the tags passed in exist.
    let {err: v_err, tags} = verifyTags(tag_names)
    if(v_err && tags === undefined) {
        console.log(v_err)
        return v_err;
    } else if(v_err && tags !== undefined) { //At least one of the tags didnt exist.
        return new Error(`The following tags do not exist. ${tags.join(', ')}`);
    } //All tags are valid, lets just move on.

    let image_id        = undefined;
    let {err, image}    = DAL.findImageByHashId(file_hash);

    if(err) {
        console.log(err);
    } else if (image !== undefined) {
        fs.unlink(file_path, function(err3) {
            if(err3) {
                console.log("Failed to delete duplicate file.")
                console.log(err3);
            }
        });
        image_id = image.image_id;
    }

    if(image_id === undefined)
    {
        let {err: err_i, info} = DAL.insertIntoImages(file_hash, ext, user_id);
    
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
            image_id = info.lastInsertRowid;
        }
    }

    if(image_id === undefined) {
        return message.channel.send("Failed to add image to DB.")
    } else {
        let tag_ids = tags.map(function(tag) {return tag['tag_id'];})
        let {err: it_err, info:it_info} = DAL.insertIntoImageTag([image_id], tag_ids);
        if(it_err) {
            return Error(`Failed to create relationship between Image: ${it_info.lastInsertRowid} and Tag: ${tag_id}`)
        }
    }
}

let verifyTags = function(tag_names) {
    let {err, tags} = DAL.findTagsByNames(tag_names)
    if(err) {
        console.log(err)
        return {err: new Error("Crashed while verifying tags."), tags: undefined};
    } else if(tag_names.length !== tags.length) { //At least one of the tags didnt exist.
        var found_tags = tags.map(function(tag) {
            return tag['name'];
        });

        let invalid_tags = tag_names.filter(tag => !found_tags.includes(tag));
        return {err: new Error(`Invalid tags passed.`), tags: invalid_tags};
    } else {
        return {err: undefined, tags: tags}
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
            if(song.duration <= global.clip_length) {
                song.is_clip = 1;
            } else {
                song.is_clip = 0;
            }

            DAL.updateSong(song);
        }
    });
}

//Yeah its fucking inefficient but.... fuck you
let rebuildAudioGist = function() {
    let {err, songs} = DAL.getAllSongs();

    if(err) {
        return new Error("Failed to grab all songs to build the list");
    } else {
        try {
            const octokit = new Octokit({
                auth: auth.github_token
              });
        
            let table = [];
            table.push(["ID", "Song"])
            songs.forEach((song) => {
                table.push([song.song_id, song.name])
            });
    
            let payload = {};
            payload.gist_id = "c76103763a2f785162d30c841094e795";
            payload.description = "All the audio files avaiable to play."
            payload.files = {
                "Audio.md": {
                    content: mdt(table)
                }
            };
            
            octokit.gists.update(payload, (error, result) => {
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

let postRandomImageByTag = function(message, tag_name) {
    const time = process.hrtime();
    const NS_PER_SEC = 1e9;

    let {err: t_err, tag} = DAL.findTagByName(tag_name);
    if(t_err) {
        return message.channel.send("Crashed while finding tag.")
    } else if (tag === undefined) {
        return message.channel.send(`There is no tag with the name. ${tag_name}.`)
    } //Valid tag.

    let {err, image} = DAL.getRandomImageByTag(tag.tag_id);
    if(err) {
        console.log(err);
        message.channel.send("Crashed finding image");
    } else if(image === undefined) {
        message.channel.send(`Couldnt find any images for ${tag.name}.`);
    } else {
        let file = path.resolve(global.image_dirs.hashed, image.hash_id + image.extension);
        message.channel.send("", {"files": [file]})
        .then(post => {
            const diff = process.hrtime(time);
            console.log(`Posted ${(diff[0] * NS_PER_SEC + diff[1])/1000000} ms`);
            //Store the posted image message_id to the tag/cmd that was called.  For use in untagging/retagging
            global.img_resp_to_tag[post.id] = tag
            global.img_resp_to_tag_order.push(post.id)

            if(global.img_resp_to_tag_order.length > global.img_resp_to_tag_max_len) {
                let old_id = global.img_resp_to_tag_order.shift()
                delete global.img_resp_to_tag[old_id]
            }

            const filter = (reaction, user) => {
                return reaction.emoji.name === '❌' && isAdmin(message.guild.members.get(user.id))
            };

            const collector = post.createReactionCollector(filter, { time: 30000 });
            collector.on('collect', r => {
                console.log(`Collected ${r.emoji.name}`);

                let attachments = post.attachments.array();
                let hash = attachments[0].filename.replace(/\.[^/.]+$/, ""); //Strip off extention
                let {err, image} = deleteImageByHash(hash);
                if(err) {
                    message.channel.send(err.message);
                } else if (image === undefined) {
                    message.channel.send("No image to delete");
                } else {
                    message.channel.send(`Image: ${image.hash_id}${image.extension}  has been removed.`);
                    post.delete();
                }
            });
        })
        .catch(console.error);
    }
}

//{err: Error, image: {}}
let deleteImageByHash = function(hash) {
    let {err, image} = DAL.findImageByHashId(hash);
    if(err) {
        console.log(err);
        return {err: new Error("Crashed while finding image."), image: undefined}
    } else if (image === undefined) {
        return {err: undefined, image: undefined} //no image
    } else {
        let {err: d_err, info} = DAL.deleteImageById(image.image_id);
        if(d_err) {
            console.log(d_err);
            return {err: new Error("Crashed while deleting image."), image: undefined} //no image
        } else if (info.changes === 0) {
            message.channel.send("There was no image with that hash.")
            return {err: undefined, image: undefined} //no image
        } else {
            let file_path = path.resolve(global.image_dirs.hashed, image.hash_id + image.extension)
            let trash_path = path.resolve(global.image_dirs.trash, image.hash_id + image.extension)
            fs.rename(file_path, trash_path, (err) => {
                if(err) {
                    console.log(`Failed to move deleted image, ${file_path} to ${trash_path}`);
                    console.log(err);
                }
            })
           return {err: undefined, image: image}
        }
    }
}

let isUserActionAllowed = function(user, command, server_id) {
    let server      = global.servers[server_id]
    if(server.super_admins.includes(user.id)) {
        //Super admin, dont bother checking table....
        return 1
    }

    let docs          = command.docs();
    let {err, access} = DAL.findAccessByUserIdAndCommand(user.id, docs.full_command);

    if(access === undefined) { //This user is missing permissions, lets set them.
        DAL.initUserAccess(user.id)
    }

    if(access) { //User has an access entry for this command.
        return access.is_allowed
    } else {// User has no access entry, rely on default restriction.
        return docs.default_access //Return true if command is not restricted
    }
}

let updateCommandList = function() {
    let command_folders_path = path.resolve("built", "commands");
    let commands = [];

    recursive(command_folders_path, function (err, files) {
        files.forEach((file) => {
            if(file.endsWith('.js')) {
                let temp = require(file);
                let keys = Object.keys(temp);
                if (keys.includes("docs")) {
                    let docs = temp.docs();
                    let command = {command: docs.full_command, default_access: docs.default_access}
                    commands.push(command)
                } 
            }
        });
        //Got all the commands
        DAL.insertCommands(commands);
    });
}

let generateAudioList = function() {
    let {err, songs} = DAL.getSongListData()

    if(err) {
        console.log(err);
        return {err: new Error("Crashed while finding image."), image: undefined}
    } else {
        const fs = require('fs')
        //let data_path = path.resolve("src", "website", "data", "data.json");
        try {
            fs.writeFile("/var/www/html/data.json", JSON.stringify(songs), function(err) {
                if(err) {
                    console.log(err);
                    return message.channel.send("Failed to write updated songs json to website/data.json")
                }
            });

        } catch (err) {
            console.error(err)
        }
    }
}

let updateMembersList = function(members) {
    let members_list = Array()
    members.forEach((val, key) => {
        members_list.push({member_id: val.id, username: val.user.username})
    });

    DAL.updateMembersList(members_list)
}

module.exports.isInt = isInt;
module.exports.isAdmin = isAdmin;
module.exports.playAudio = playAudio;
module.exports.playUrl = playUrl;
module.exports.processAudioFile = processAudioFile;
module.exports.rebuildAudioGist = rebuildAudioGist;
module.exports.generateAudioList = generateAudioList;
module.exports.processImageFile = processImageFile;
module.exports.getFileSizeInMegaBytes = getFileSizeInMegaBytes;
module.exports.processAudioFileTask = processAudioFileTask;
module.exports.deleteImageByHash = deleteImageByHash;
module.exports.postRandomImageByTag = postRandomImageByTag;
module.exports.verifyTags = verifyTags;
module.exports.isUserActionAllowed = isUserActionAllowed;
module.exports.updateCommandList = updateCommandList;

module.exports.updateMembersList = updateMembersList;

export {isInt};
export {isAdmin};
export {playAudio};
export {playUrl};
export {processAudioFile};
export {rebuildAudioGist};
export {generateAudioList};
export {processImageFile};
export {getFileSizeInMegaBytes};
export {processAudioFileTask};
export {deleteImageByHash};
export {postRandomImageByTag};
export {verifyTags};
export {isUserActionAllowed};
export {updateCommandList};
export {updateMembersList};