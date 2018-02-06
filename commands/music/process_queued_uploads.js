const path      = require("path");
const fs        = require("fs");
const md5       = require('md5');
const { exec }  = require('child_process');

exports.run = (client, message, args) => {
    
    let files_to_process        = [];
    
    let uploaded_audio_folder   = path.resolve("uploaded_audio");
    let hashed_audio_path       = path.resolve("hashed_audio");
    let stored_audio_path       = path.resolve("stored_audio");

    fs.readdirSync(uploaded_audio_folder).forEach(file => {
        files_to_process.push(file);
    });

    files_to_process.forEach(function(file){
        console.log(`Started Processing file, ${file}`)
        let uploaded_file_path  = path.resolve(uploaded_audio_folder, file);
        let file_hash           = md5(fs.readFileSync(uploaded_file_path));
        let base_file_name      = file.replace(/\.[^/.]+$/, "")
        let new_file_name       = file_hash + ".mp3"
        
        let hashed_file_path    = path.resolve(hashed_audio_path, new_file_name);
        let stored_file_path    = path.resolve(stored_audio_path, `${file}-${file_hash}`)

        exec(`ffmpeg-normalize ${uploaded_file_path} -c:a libmp3lame -ofmt mp3 -ext mp3 -o ${hashed_file_path} -f -t -20`, (err, stdout, stderr) => {
            if (err) {// node couldn't execute the command
                console.log("Couldnt run command");
                console.log(err);
                return;
            } else {
                console.log(`Finished Normalizing file, ${file}`)
                DB.serialize(function() {
                    var stmt = DB.prepare("INSERT INTO song (hash_id, name, source) VALUES (?, ?, ?)");
                    
                    stmt.run(file_hash, base_file_name, stored_file_path, function(err) {
                        if(err) {
                            if(err.message.indexOf("UNIQUE") > -1) {//Unique constraint error
                                DB.get(`SELECT * FROM song WHERE song.hash_id = "${file_hash}"`, (err2, row) => {
                                    if (row === undefined) {
                                        console.log(`SELECT * FROM song WHERE song.song_id = "${file_hash}"`)
                                        console.log(err2);
                                        return message.channel.send(`Pretty sure we borkded, Send Adam the file.`);
                                    } else {
                                        return message.channel.send(`That file already exists on the server by the name, ${row.name}`)
                                    }
                                });
                            } else {
                                console.log(err);
                                message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
                            } 
                        } else {
                            message.channel.send(`The song ${base_file_name} has been added, You're the DJ ${message.author.username}!`);
                            
                            fs.rename(uploaded_file_path, stored_file_path, (err) => {
                                if(err) {
                                    console.log(`Failed to move file, ${uploaded_file_path} to ${stored_file_path}`);
                                    console.log(err);
                                }
                            })

                        }
                    });
                    stmt.finalize();
                });
            }
        });
    });
};

exports.help = () =>{
    return "Should most likely disappear. Pay no attention to the man behind the curtain.";
};