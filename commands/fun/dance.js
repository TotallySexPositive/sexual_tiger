const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "dance");	
}

exports.help = () =>{
    return "to the left, cha cha real slow";
};