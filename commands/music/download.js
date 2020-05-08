"use strict";

const fs        = require('fs');
const path      = require("path");
const DAL       = require(path.resolve("dal.js"));
const UTIL      = require(path.resolve("utils.js"));
const sanitize  = require("sanitize-filename");
const youtubedl = require('youtube-dl');
const extractDomain  = require('extract-domain');
const validator = require('validator');

exports.run = (client, message, args) => {
    let server = global.servers[message.guild.id];
 
    if(args.length !== 1) {
        return message.channel.send("It seems you sent too much or too little info.");
    }

    let url = args[0];

    if(!validator.isURL(url)) {
        return message.channel.send("Invalid url sent.")
    }

    let domain      = extractDomain(url)
    let {err, song} = DAL.findSongByUrl(url);

    if(err) {
        console.log("Shit, what?");
        console.log(err);
        message.channel.send("Ummm, we kind of crashed but are trying to continue, wish me luck.");
    } else if (song !== undefined) {
        return message.channel.send(`That clip is already in the DB under the name, ${song.name}`);
    } else {
        youtubedl.getInfo(url, undefined, function(err, info) {
            if(err) {
                console.log(err);
                return message.channel.send(`Something happened while trying to download audio from that ${domain} link.`);
            } else if (info.length_seconds > 600) { //10 minutes
                return message.channel.send("That video is too fucking long.")
            } else {
                let save_to     = path.resolve(global.audio_dirs.tmp, sanitize(info.title) + `.mp3`);
                let write_steam = youtubedl(url, ['-x', '--audio-format', 'mp3']).pipe(fs.createWriteStream(save_to))

                message.channel.send(`Download of, ${info.title}, from ${domain} has started.`)
                
                write_steam.on('finish', () => {
                    message.channel.send(`Done downloading the audio from ${domain}.`)
                    UTIL.processAudioFile(save_to, url, message, (err, success) => {
                        if(err) {
                            message.channel.send(err.message);
                        } else {
                            message.channel.send(success);
                        }
                    });
                })
            }
        })
    }
};

exports.help = () =>{
    return "Downloads a youtube video's audio and stores it in the DB";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: "",
        full_command: "youtube",
        command: "youtube",
        description: "Download a video from youtube and add the audio to the bot",
        syntax: "youtube [youtube_url]",
        examples: [
            {
                description: "Add a song from youtube to the bot",
                code: "youtube https://www.youtube.com/watch?v=U9t-slLl30E"
            }
        ]
    }
    return docs;
};