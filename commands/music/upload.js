const {spawn}   = require('child_process');
const path      = require("path");
const request   = require("request");
const fs        = require("fs")
const UTIL      = require(path.resolve("utils.js"));

exports.run = (client, message, args) => {
    let attachments = message.attachments.array()
    if (attachments.length < 0) return message.channel.send("Need to actually attach something");
	message.channel.send(`Downloading ${attachments.length} attachments.`);

    attachments.forEach(item => {
        fpath = path.resolve(global.audio_dirs.uploaded,item.filename)
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
}

exports.help = () =>{
    return "Upload a music file!";
};