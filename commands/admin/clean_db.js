const probe = require('node-ffprobe');
const path  = require("path")
const fs    = require('fs');
const DAL   = require(path.resolve("dal.js"))
const UTIL  = require(path.resolve("utils.js"))


exports.run = (client, message, args) => {
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
}

exports.help = () =>{
    return "Searches the DB for any songs that are in the DB but the files do not exist.  Then destroys the records.";
};