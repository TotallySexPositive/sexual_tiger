const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "pout");	
}

exports.help = () =>{
    return "Pouty pouty pout";
};