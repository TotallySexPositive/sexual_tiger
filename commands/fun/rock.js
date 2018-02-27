const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "rock");	
}

exports.help = () =>{
    return "Rock Paper Si!";
};