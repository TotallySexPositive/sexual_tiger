const path      = require("path");
const fs        = require("fs");
const md5       = require('md5');
const { exec }  = require('child_process');
const DAL       = require(path.resolve("dal.js"))
const UTIL       = require(path.resolve("utils.js"))
var Queue       = require('better-queue');

exports.run = (client, message, args) => {
    
    let uploaded_audio_folder   = global.audio_dirs.uploaded;
    let hashed_audio_path       = global.audio_dirs.hashed;
    let stored_audio_path       = global.audio_dirs.stored;

    let files_to_process        = fs.readdirSync(uploaded_audio_folder).filter(file => file !== ".placeholder")
    var q                       = new Queue(UTIL.processAudioFileTask, function (err, result) {
       console.log("Call back of Queue")
      });
   
      q.on('drain', function (){message.channel.send("Done processing all files in queue.")})

    files_to_process.some(function(file){
        let uploaded_file_path  = path.resolve(uploaded_audio_folder, file);
        console.log(`Adding file ${uploaded_file_path} to the queue.`)
        q.push({ file_path: uploaded_file_path, url: null, message: message }).on('finish', function (result) {
            message.channel.send(result)
          })
          .on('failed', function (err) {
            message.channel.send(err)
          });
    });
};

exports.help = () =>{
    return "Should most likely disappear. Pay no attention to the man behind the curtain.";
};

exports.docs = () => {
  let docs = {
      default_access: 0,
      tab: "admin",
      link: "general",
      parent: "",
      full_command: "process_queued_uploads",
      command: "process_queued_uploads",
      description: "Tell the bot to process any songs that have been FTP uploaded onto the server",
      syntax: "process_queued_uploads",
      examples: [
          {
              description: "Tell the bot to process any ftp uploaded songs.",
              code: "process_queued_uploads"
          }
      ]
  }
  return docs;
};