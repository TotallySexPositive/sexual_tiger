import path from "path"
import fs from "fs"
import md5 from "md5"
import {exec} from "child_process"
import auth from require(path.resolve("auth.json"))
import {Octokit} from "@octokit/rest"
import probe from "node-ffprobe"
import recursive from "recursive-readdir"
import {GuildMember, Message, Permissions, VoiceChannel} from "discord.js"
import {Command} from "./types/Command"

import * as DAL from "./dal"
import {mdt} from "markdown-table"
import { CustomNodeJsGlobal } from "./types/CustomNodeJsGlobal"
import { Server } from "./types/Server"
import { processAudioFile } from "./utils"
declare const global: CustomNodeJsGlobal;

export function isInt(value: string) : boolean
{
    const er = /^-?[0-9]+$/
    return er.test(value)
}

export function isAdmin(member: GuildMember) : boolean
{
    return member.hasPermission(Permissions.FLAGS.ADMINISTRATOR)
}

export async function playAudio (voice_channel: VoiceChannel)
{
    const server_id   = voice_channel.guild.id
    const server      = global.servers[server_id]

    server.connectionPromise    = voice_channel.join()

    //If there is a song playing, replay it. If not grab the first one off the list.

    if (!server.repeat || !server.current_song){
        server.current_song = server.song_queue.shift()
    } else {
        //A song is already playing, just leave current song alone, it will repeat.
    }

    const volume                  = server.current_song && server.current_song.is_clip ? server.clip_volume : server.volume

    server.connectionPromise.then(connection => {
        const dispatcher  = connection.play(path.resolve(global.audio_dirs["hashed"], `${server.current_song.hash_id}.mp3`), {volume: 1 })

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

export function playUrl(url: string, voice_channel: VoiceChannel)
{
    const server: Server = global.servers[voice_channel.guild.id]
    server.connectionPromise.then(connection => {
        const dispatcher  = connection.play(url, {volume: 1});
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
}

export function processAudioFileTask(t_obj: any, cb: any) : void
{
    return processAudioFile(t_obj.file_path, t_obj.url, t_obj.message, cb)
}

export function processAudioFile(file_path:string, url:string, message: Message, cb: any) : void
{
    const hashed_audio_path       = global.audio_dirs["hashed"];
    const stored_audio_path       = global.audio_dirs["stored"];
    console.log(`FP: ${file_path})`);

    const file_name               = path.basename(file_path);

    console.log(`Started Processing file, ${file_name}`)
    message.channel.send(`Starting to process file: ${file_name}, I'll let you know when its ready.`);

    const file_hash           = md5(fs.readFileSync(file_path));
    const cleaned_file_name   = file_name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").replace(/ +/g, " ") //Strip off extention, replace underscore and hypen with space, reduce more than 2 spaces to 1
    const new_file_name       = file_hash + ".mp3"
    
    const hashed_file_path    = path.resolve(hashed_audio_path, new_file_name);
    const stored_file_path    = path.resolve(stored_audio_path, `${cleaned_file_name}-${file_hash}`)

    const {err, song}         = DAL.findSongByHashId(file_hash);

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
            const {err, info} = DAL.insertIntoSongs(file_hash, cleaned_file_name, stored_file_path, url, message.author.id);
            
            if(err) {
                console.log(err);
                cb(new Error(`Failed to run insert song into DB. ${err.message}`), undefined);
            } else {
                probe_audio_file(file_hash);

                const err = generateAudioList();
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