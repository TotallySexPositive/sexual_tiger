"use strict";

const path = require("path");
const fs = require('fs');
import * as DAL from "./dal";
const md5 = require('md5');
const { exec } = require('child_process');
const auth = require(path.resolve("auth.json"));
const { Octokit } = require("@octokit/rest");
const mdt = require("markdown-table");
const probe = require('node-ffprobe');
const recursive = require("recursive-readdir");
import { PermissionsBitField, EmbedBuilder } from 'discord.js';
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    entersState,
    VoiceConnectionStatus
} from '@discordjs/voice';

var isInt = function (value) {
    var er = /^-?[0-9]+$/;
    return er.test(value);
}

var isAdmin = function (member) {
    if (!member || !member.permissions) return false;
    return member.permissions.has(PermissionsBitField.Flags.Administrator);
}

async function playAudio(interaction, voiceChannel, server) {
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        selfDeaf: true
    });

    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 5000);

        const player = createAudioPlayer();
        connection.subscribe(player);

        server.audioPlayer = player;
        server.voiceConnection = connection;

        playNextSong(server, voiceChannel);
    } catch (error) {
        console.error('Voice join failed:', error);
        connection.destroy();
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({ content: "Failed to join voice channel.", ephemeral: true });
        } else {
            await interaction.reply({ content: "Failed to join voice channel.", ephemeral: true });
        }
    }
}

function playNextSong(server, voiceChannel) {
    if (!server.audioPlayer) return;

    const song = server.repeat && server.current_song
        ? server.current_song
        : server.song_queue.shift();

    if (!song) {
        if (!server.maintain_presence) {
            server.voiceConnection?.destroy();
        }
        return;
    }

    server.current_song = song;

    const resource = createAudioResource(
        path.resolve(global.audio_dirs.get('hashed'), `${song.hash_id}.mp3`),
        { inlineVolume: true }
    );
    const volume = song.is_clip ? server.clip_volume : server.volume;
    resource.volume?.setVolume(volume);

    server.audioPlayer.play(resource);

    const checkFinish = setInterval(() => {
        if (server.audioPlayer.state.status === AudioPlayerStatus.Idle) {
            clearInterval(checkFinish);
            DAL.incrementNumPlays(song.song_id);
            playNextSong(server, voiceChannel);
        }
    }, 100);
}

function playUrl(url, interaction, voiceChannel) {
    const server = global.servers.get(voiceChannel.guild.id);
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        selfDeaf: true
    });

    entersState(connection, VoiceConnectionStatus.Ready, 5000).then(() => {
        const player = createAudioPlayer();
        connection.subscribe(player);
        server.audioPlayer = player;
        server.voiceConnection = connection;

        const resource = createAudioResource(url, { inlineVolume: true });
        resource.volume?.setVolume(server.clip_volume);
        player.play(resource);

        player.on(AudioPlayerStatus.Idle, () => {
            if (!server.maintain_presence) {
                server.current_song = undefined;
                connection.destroy();
            }
        });
    }).catch(reason => {
        console.log(reason);
        connection.destroy();
    });
}

var processAudioFileTask = function (t_obj, cb) {
    return processAudioFile(t_obj.file_path, t_obj.url, t_obj.message, cb)
}

var processAudioFile = function (file_path, url, message, cb) {
    let hashed_audio_path = global.audio_dirs.get('hashed');
    let stored_audio_path = global.audio_dirs.get('stored');
    console.log(`FP: ${file_path})`);

    let file_name = path.basename(file_path);

    console.log(`Started Processing file, ${file_name}`)
    message.channel.send(`Starting to process file: ${file_name}, I'll let you know when its ready.`);

    let file_hash = md5(fs.readFileSync(file_path));
    let cleaned_file_name = file_name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").replace(/ +/g, " ")
    let new_file_name = file_hash + ".mp3"

    let hashed_file_path = path.resolve(hashed_audio_path, new_file_name);
    let stored_file_path = path.resolve(stored_audio_path, `${cleaned_file_name}-${file_hash}`)

    let { err, song } = DAL.findSongByHashId(file_hash);

    if (err) {
        console.log("Oops?");
        console.log(err);
    } else if (song !== undefined) {
        fs.unlink(file_path, function (err3) {
            if (err3) {
                console.log("Failed to delete duplicate file.")
                console.log(err3);
            }
        })
        cb(new Error(`The given file already exists on the server by name, ${song.name}`), undefined);
        return;
    }

    let cmd = "nice "
    let args = ["ffmpeg-normalize", "\"" + file_path + "\"", "-c:a", "libmp3lame", "-ofmt", "mp3", "-o", "\"" + hashed_file_path + "\"", "-f", "-t", "-20"]

    exec(cmd + args.join(" "), (err, stdout, stderr) => {
        if (err) {
            if (err.message.indexOf("Invalid data found") == -1) {
                console.log("Couldnt run command");
                console.log(err);
            }
            fs.unlink(file_path, function (err3) {
                if (err3) {
                    console.log(`Failed to Deleted offending file. ${file_path}`)
                    console.log(err3);
                } else {
                    console.log(`Deleted offending file. ${file_path}`);
                    message.channel.send("I dont know what the fuck you just tried to get me to process, but I deleted it. :stuck_out_tongue: ")
                }
            })
            cb(new Error(`Failed to run ffmpeg-normalize. ${err.message}`), undefined);
        } else {
            let { err, info } = DAL.insertIntoSongs(file_hash, cleaned_file_name, stored_file_path, url, message.author.id);

            if (err) {
                console.log(err);
                cb(new Error(`Failed to run insert song into DB. ${err.message}`), undefined);
            } else {
                probe_audio_file(file_hash);

                let err = generateAudioList(message);
                if (err) {
                    message.channel.send("Failed to update audio list after adding a new song.");
                    message.channel.send(err.message);
                }
                fs.rename(file_path, stored_file_path, (err) => {
                    if (err) {
                        console.log(`Failed to move file, ${file_path} to ${stored_file_path}`);
                        console.log(err);
                    }
                })
                cb(undefined, `The song ID: ${info.lastInsertRowid}  Name: ${cleaned_file_name} has been added, You're the DJ ${message.author.username}!`);
            }
        }
    });
}

var processImageFile = function (file_path, tag_names, user_id) {
    let hashed_image_path = global.image_dirs.get('hashed');
    let file_name = path.basename(file_path);
    let ext = path.extname(file_path).replace(/\?.*$/, "");
    let tag_id = -1;

    if (ext === "" || ext === "." || ext.length > 5) ext = ".gif";

    let file_hash = md5(fs.readFileSync(file_path));
    let new_file_name = file_hash + ext
    let hashed_file_path = path.resolve(hashed_image_path, new_file_name);

    let { err: v_err, tags } = verifyTags(tag_names)
    if (v_err && tags === undefined) {
        console.log(v_err)
        return v_err;
    } else if (v_err && tags !== undefined) {
        return new Error(`The following tags do not exist. ${tags.join(', ')}`);
    }

    let image_id = undefined;
    let { err, image } = DAL.findImageByHashId(file_hash);

    if (err) {
        console.log(err);
    } else if (image !== undefined) {
        fs.unlink(file_path, function (err3) {
            if (err3) {
                console.log("Failed to delete duplicate file.")
                console.log(err3);
            }
        });
        image_id = image.image_id;
    }

    if (image_id === undefined) {
        let { err: err_i, info } = DAL.insertIntoImages(file_hash, ext, user_id);

        if (err_i) {
            console.log(err_i);
            return new Error(`Error while inserting image.`);
        } else {
            fs.rename(file_path, hashed_file_path, (err) => {
                if (err) {
                    console.log(`Failed to move file, ${file_path} to ${hashed_file_path}`);
                    console.log(err);
                }
            });
            image_id = info.lastInsertRowid;
        }
    }

    if (image_id === undefined) {
        return new Error("Failed to add image to DB.")
    } else {
        let tag_ids = tags.map(function (tag) { return tag['tag_id']; })
        let { err: it_err, info: it_info } = DAL.insertIntoImageTag([image_id], tag_ids);
        if (it_err) {
            return Error(`Failed to create relationship between Image: ${it_info.lastInsertRowid} and Tag: ${tag_id}`)
        }
    }
}

let verifyTags = function (tag_names) {
    let { err, tags } = DAL.findTagsByNames(tag_names)
    if (err) {
        console.log(err)
        return { err: new Error("Crashed while verifying tags."), tags: undefined };
    } else if (tag_names.length !== tags.length) {
        var found_tags = tags.map(function (tag) {
            return tag['name'];
        });

        let invalid_tags = tag_names.filter(tag => !found_tags.includes(tag));
        return { err: new Error(`Invalid tags passed.`), tags: invalid_tags };
    } else {
        return { err: undefined, tags: tags }
    }
}

let probe_audio_file = function (file_hash) {
    probe(path.resolve(global.audio_dirs.get('hashed'), file_hash + ".mp3"), function (err, data) {
        let { err: s_err, song } = DAL.findSongByIdentifier(file_hash)
        if (s_err) {
            console.log("Probe Audio File: Uh oh...");
            console.log(file_hash);
        } else {
            song.duration = Math.ceil(data.streams[0].duration);
            if (song.duration <= global.clip_length) {
                song.is_clip = 1;
            } else {
                song.is_clip = 0;
            }

            DAL.updateSong(song);
        }
    });
}


let getFileSizeInMegaBytes = function (file) {
    const stats = fs.statSync(file)
    const file_size_in_bytes = stats.size
    const file_size_in_mb = file_size_in_bytes / 1000000.0
    return file_size_in_mb;
}

let postRandomImageByTag = async function (interaction, tag_name) {
    const time = process.hrtime();
    const NS_PER_SEC = 1e9;

    let replyFn = interaction.deferred || interaction.replied ? interaction.editReply.bind(interaction) : interaction.reply.bind(interaction);

    let { err: t_err, tag } = DAL.findTagByName(tag_name);
    if (t_err) {
        return replyFn({ content: "Crashed while finding tag.", ephemeral: true });
    } else if (tag === undefined) {
        return replyFn({ content: `There is no tag with the name. ${tag_name}.`, ephemeral: true });
    }

    let { err, image } = DAL.getRandomImageByTag(tag.tag_id);
    if (err) {
        console.log(err);
        return replyFn({ content: "Crashed finding image", ephemeral: true });
    } else if (image === undefined) {
        return replyFn({ content: `Couldnt find any images for ${tag.name}.`, ephemeral: true });
    } else {
        let file = path.resolve(global.image_dirs.get('hashed'), image.hash_id + image.extension);
        const post = await replyFn({ files: [file] });

        global.img_resp_to_tag[post.id] = tag;
        global.img_resp_to_tag_order.push(post.id);

        if (global.img_resp_to_tag_order.length > global.img_resp_to_tag_max_len) {
            let old_id = global.img_resp_to_tag_order.shift();
            delete global.img_resp_to_tag[old_id];
        }

        const filter = (reaction, user) => {
            return reaction.emoji.name === '❌' && !user.bot;
        };

        try {
            await post.react('❌');
            const collector = post.createReactionCollector({ filter, time: 30000 });
            collector.on('collect', async (r) => {
                console.log(`Collected ${r.emoji.name}`);

                let attachments = post.attachments.array();
                if (attachments.length === 0) return;
                let hash = attachments[0].name.replace(/\.[^/.]+$/, "");
                let { err, image } = deleteImageByHash(hash);
                if (err) {
                    await interaction.followUp({ content: err.message });
                } else if (image === undefined) {
                    await interaction.followUp({ content: "No image to delete" });
                } else {
                    await interaction.followUp({ content: `Image: ${image.hash_id}${image.extension} has been removed.` });
                    post.delete().catch(() => {});
                }
            });
        } catch (e) {
            console.error("Failed to add reaction collector:", e.message);
        }
    }
}

let deleteImageByHash = function (hash) {
    let { err, image } = DAL.findImageByHashId(hash);
    if (err) {
        console.log(err);
        return { err: new Error("Crashed while finding image."), image: undefined }
    } else if (image === undefined) {
        return { err: undefined, image: undefined }
    } else {
        let { err: d_err, info } = DAL.deleteImageById(image.image_id);
        if (d_err) {
            console.log(d_err);
            return { err: new Error("Crashed while deleting image."), image: undefined }
        } else if (info.changes === 0) {
            return { err: undefined, image: undefined }
        } else {
            let file_path = path.resolve(global.image_dirs.get('hashed'), image.hash_id + image.extension)
            let trash_path = path.resolve(global.image_dirs.get('trash'), image.hash_id + image.extension)
            fs.rename(file_path, trash_path, (err) => {
                if (err) {
                    console.log(`Failed to move deleted image, ${file_path} to ${trash_path}`);
                    console.log(err);
                }
            })
            return { err: undefined, image: image }
        }
    }
}

let isUserActionAllowed = function (user_id, command_name, server_id) {
    let server = global.servers.get(server_id);
    if (!server) return true;
    if (server.super_admins.includes(user_id)) {
        return 1;
    }

    let { err, access } = DAL.findAccessByUserIdAndCommand(user_id, command_name);

    if (access === undefined) {
        DAL.initUserAccess(user_id);
    }

    if (access) {
        return access.is_allowed;
    } else {
        let { err: cmd_err, command } = DAL.findCommandByName(command_name);
        if (command) {
            return command.default_access;
        }
        return true;
    }
}

let updateCommandList = function () {
    let command_folders_path = path.resolve(__dirname, "commands");
    let commands = [];

    recursive(command_folders_path, function (err, files) {
        if (err) { console.error(err); return; }
        files.forEach((file) => {
            if (file.endsWith('.js') || file.endsWith('.ts')) {
                try {
                    delete require.cache[require.resolve(file)];
                    let temp = require(file);
                    if (temp.data) {
                        let command = { command: temp.data.name, default_access: 1 };
                        commands.push(command);
                    }
                } catch (e) {
                    // Skip files that fail to load
                }
            }
        });
        DAL.insertCommands(commands);
    });
}

let generateAudioList = function (message) {
    let { err, songs } = DAL.getSongListData()

    if (err) {
        console.log(err);
        return new Error("Crashed while finding image.");
    } else {
        try {
            fs.writeFile("/var/www/html/data.json", JSON.stringify(songs), function (err) {
                if (err) {
                    console.log(err);
                    if (message && message.channel) {
                        message.channel.send("Failed to write updated songs json to website/data.json");
                    }
                }
            });

        } catch (err) {
            console.error(err)
        }
    }
}

let updateMembersList = function (members) {
    let members_list = Array()
    members.forEach((val, key) => {
        members_list.push({ member_id: val.id, username: val.user.username });
    });

    DAL.updateMembersList(members_list);
}

let splitTable = function (table, maxChars) {
    if (maxChars === undefined) maxChars = 1950;
    const lines = table.split('\n');
    const chunks = [];
    let currentChunk = '';

    for (const line of lines) {
        if (currentChunk.length + line.length + 1 > maxChars && currentChunk.length > 0) {
            chunks.push(currentChunk);
            currentChunk = line;
        } else {
            if (currentChunk.length > 0) {
                currentChunk += '\n' + line;
            } else {
                currentChunk = line;
            }
        }
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
}

module.exports.isInt = isInt;
module.exports.isAdmin = isAdmin;
module.exports.playAudio = playAudio;
module.exports.playUrl = playUrl;
module.exports.processAudioFile = processAudioFile;
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
module.exports.splitTable = splitTable;

export { isInt };
export { isAdmin };
export { playAudio };
export { playUrl };
export { processAudioFile };
export { generateAudioList };
export { processImageFile };
export { getFileSizeInMegaBytes };
export { processAudioFileTask };
export { deleteImageByHash };
export { postRandomImageByTag };
export { verifyTags };
export { isUserActionAllowed };
export { updateCommandList };
export { updateMembersList };
export { splitTable };
