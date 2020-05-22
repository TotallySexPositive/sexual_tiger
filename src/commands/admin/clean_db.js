const probe = require('node-ffprobe');
const path  = require("path")
const fs    = require('fs');
const DAL   = require(path.resolve("dal.js"))
const UTIL  = require(path.resolve("utils.js"))


exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('admin_clean_db').startTimer()
    let {err: s_err, songs} = DAL.getAllSongs()
    if(s_err) {
        console.log("Failed to get songs");
    } else {
        let ids_to_delete = [];
        songs.forEach(song => {
            if (!fs.existsSync(song.source)) {
                let {err: d_err, info} = DAL.deleteSongById(song.song_id)
                if(d_err) {
                    console.log(`Failed to delete ${song.song_id}`);
                    console.log(d_err);
                }
            }
        });
    }
    end()
}

exports.help = () =>{
    return "Searches the DB for any songs that are in the DB but the files do not exist.  Then destroys the records.";
};

exports.docs = () => {
    let docs = {
        default_access: 0,
        tab: "admin",
        link: "general",
        parent: "",
        full_command: "clean_db",
        command: "clean_db",
        description: "Deletes all Song entries from the DB where the source file no longer exists.",
        syntax: "clean_db",
        examples: [
            {
                description: "Clean up all records to missing songs.",
                code: "clean_db"
            }
        ]
    }
    return docs;
};