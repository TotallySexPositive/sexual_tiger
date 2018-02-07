const path      = require("path");
const fs        = require("fs");
const md5       = require('md5');
const { exec }  = require('child_process');
const DAL   = require(path.resolve("dal.js"))

exports.run = (client, message, args) => {
    
    let uploaded_audio_folder   = path.resolve("uploaded_audio");
    let hashed_audio_path       = path.resolve("hashed_audio");
    let stored_audio_path       = path.resolve("stored_audio");

    let files_to_process        = fs.readdirSync(uploaded_audio_folder).filter(file => file !== ".placeholder")

    files_to_process.some(function(file){
        console.log(`Started Processing file, ${file}`)
        let uploaded_file_path  = path.resolve(uploaded_audio_folder, file);
        let file_hash           = md5(fs.readFileSync(uploaded_file_path));
        let base_file_name      = file.replace(/\.[^/.]+$/, "")
        let new_file_name       = file_hash + ".mp3"
        
        let hashed_file_path    = path.resolve(hashed_audio_path, new_file_name);
        let stored_file_path    = path.resolve(stored_audio_path, `${file}-${file_hash}`)

        let {err, song}         = DAL.findSongByHashId(file_hash);

        if(err) {
            console.log("Oops?");
            console.log(err);
        } else if (song !== undefined) {
            message.channel.send(`That file already exists on the server by the name, ${song.name}`)
            fs.unlink(uploaded_file_path, function(err3){
                if(err3) {
                    console.log("Failed to delete duplicate file.")
                    console.log(err3);
                }
            })
            return;
        }
            
        exec(`ffmpeg-normalize "${uploaded_file_path}" -c:a libmp3lame -ofmt mp3 -ext mp3 -o ${hashed_file_path} -f -t -20`, (err, stdout, stderr) => {
            if (err) {// node couldn't execute the command
                if(err.message.indexOf("Invalid data found") == -1) { //Only output error if we dont know why it happened.
                    console.log("Couldnt run command");
                    console.log(err);
                } 
                fs.unlink(uploaded_file_path, function(err3){
                    if(err3) {
                        console.log(`Failed to Deleted offending file. ${uploaded_file_path}`)
                        console.log(err3);
                    } else {
                        console.log(`Deleted offending file. ${uploaded_file_path}`)
                    }
                })
                return;
            } else {
                console.log(`Finished Normalizing file, ${file}`)

                let {err, info} = DAL.insertIntoSongs(file_hash, base_file_name, stored_file_path)
                
                if(err) {
                    console.log(err);
                    message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
                } else {
                    message.channel.send(`The song ${base_file_name} has been added, You're the DJ ${message.author.username}!`);
                    
                    fs.rename(uploaded_file_path, stored_file_path, (err) => {
                        if(err) {
                            console.log(`Failed to move file, ${uploaded_file_path} to ${stored_file_path}`);
                            console.log(err);
                        }
                    })
                }
            }
        });
    });
};

exports.help = () =>{
    return "Should most likely disappear. Pay no attention to the man behind the curtain.";
};