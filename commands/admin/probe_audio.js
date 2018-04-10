const probe = require('node-ffprobe');
const path  = require("path")
const fs    = require('fs');
const DAL   = require(path.resolve("dal.js"))
const UTIL  = require(path.resolve("utils.js"))


exports.run = (client, message, args) => {
    let hashed_audio_path       = global.audio_dirs.hashed;
    let files_to_process        = fs.readdirSync(global.audio_dirs.hashed)

    files_to_process.some(function(file){
        probe(path.resolve(global.audio_dirs.hashed, file), function(err, data) {
            let {err: s_err, song} = DAL.findSongByIdentifier(file.substring(0, 32))
            if(s_err) {
                console.log("Failed to find song in DB that existed in hash folder.  Uh oh...");
                console.log(file.substring(0, 32));
            } else {
                song.duration = Math.ceil(data.streams[0].duration);
                DAL.updateSong(song);
            }
        });
    });
}

exports.help = () =>{
    return "Gently probes all audio files from behind to find out just how 'long' :wink: they are.";
};

exports.docs = () => {
    let docs = {
        tab: "admin",
        link: "general",
        parent: "",
        full_command: "prob_audio",
        command: "prob_audio",
        description: "Probes all hashed audio files and updates their length in the database.",
        syntax: 'prob_audio',
        examples: [
            {
                description: "Probe all audio clips to update length.",
                code: `prob_audio`
            }
        ]
    }
    return docs;
};