const probe = require('node-ffprobe');
const path  = require("path")
const fs    = require('fs');
import * as DAL from "../../dal";

exports.run = (client, message, args) => {
    
    let hashed_audio_path       = global.audio_dirs.hashed;
    let files_to_process        = fs.readdirSync(global.audio_dirs.hashed)
    console.log("Probing audio!")
    
    probe.SYNC = true;
    files_to_process.some(function(file) {
        probe(path.resolve(global.audio_dirs.hashed, file)).then(data => {
            let {err: s_err, song} = DAL.findSongByIdentifier(file.substring(0, 32))
            if(s_err) {
                console.log("Failed to find song in DB that existed in hash folder.  Uh oh...");
                console.log(file.substring(0, 32));
            } else {
                song.duration = Math.ceil(data.streams[0].duration);
                DAL.updateSong(song);
            }
            console.log("in that probe yo")
        });
    });
    console.log("Probing audio Finished!")

}

exports.help = () =>{
    return "Gently probes all audio files from behind to find out just how 'long' :wink: they are.";
};

exports.docs = () => {
    let docs = {
        default_access: 0,
        tab: "admin",
        link: "general",
        parent: "",
        full_command: "probe_audio",
        command: "probe_audio",
        description: "Probes all hashed audio files and updates their length in the database.",
        syntax: 'probe_audio',
        examples: [
            {
                description: "Probe all audio clips to update length.",
                code: `probe_audio`
            }
        ]
    }
    return docs;
};