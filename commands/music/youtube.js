const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require("path")
const DAL = require(path.resolve("dal.js"))

exports.run = (client, message, args) => {
    let server = global.servers[message.guild.id];
    let save_to = path.resolve("uploaded_audio", "test" )

    ytdl.getInfo(args[0], {filter: "audioonly"}, (err, info) => {
        if(err) {
            message.channel.send("Something happened while trying to download audio from that youtube link.")
            console.log(err);
            return;
        } else {
            let save_to = path.resolve("uploaded_audio", `${info.title}.mp3`)
            
            let write_steam = ytdl.downloadFromInfo(info, {filter: "audioonly"}).pipe(fs.createWriteStream(save_to))

            write_steam.on('finish', () => {
                message.channel.send("Done downloading the audio from youtube.")
            })
        }
    })

};