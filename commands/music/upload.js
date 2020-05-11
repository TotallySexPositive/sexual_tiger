const {spawn}   = require('child_process');
const path      = require("path");
const request   = require("request");
const fs        = require("fs")
const UTIL      = require(path.resolve("utils.js"));

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('upload').startTimer()
    let attachments = message.attachments.array()
    if (attachments.length < 0) return message.channel.send("Need to actually attach something");
	message.channel.send(`Downloading ${attachments.length} attachments.`);

    attachments.forEach(item => {
        fpath = path.resolve(global.audio_dirs.uploaded,item.name)
        request(item.url)
            .pipe(fs.createWriteStream(fpath))
            .on('finish', () => {
                UTIL.processAudioFile(fpath, null, message, (err, success) => {
                    if(err) {
                        message.channel.send(err.message);
                    } else {
                        message.channel.send(success);
                    }
                });
            })
            .on('error', (err) => {console.error(err)})
    })
    end()
}

exports.help = () =>{
    return "Upload a music file!";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: "",
        full_command: "upload",
        command: "upload",
        description: "Upload a song to the bot so it can be played back.  Max file size is 8MB due to discord limitations.  Most audio and video formats accepted.  Upload a file and type the command as the comment on the upload.",
        syntax: "upload",
        examples: [
            {
                description: "Upload a song.",
                code: "upload"
            }
        ]
    }
    return docs;
};