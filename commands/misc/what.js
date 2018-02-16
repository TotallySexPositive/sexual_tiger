const path = require("path")
const DAL = require(path.resolve("dal.js"))
const UTIL = require(path.resolve("utils.js"))
const parser = require('yargs-parser')

exports.run = (client, message, args) => {
    
    var opts = {
        alias: {
            playlist: ['p'],
            song: ['s'],
            playlist_id: ['pid'],
            song_id: ['sid']
        },
        configuration: {
            'short-option-groups': false
          }
    }
    var argv = parser(message.content.replace(/= /g, "="), opts)
    console.log(argv)
    //message.channel.send(argv);
};
exports.help = () =>{
    return "Who?";
};

//$what am i -f doing -d one two --words= "one two three"