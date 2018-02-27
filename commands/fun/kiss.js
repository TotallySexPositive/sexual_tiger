const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "kiss");	
}

exports.help = () =>{
    return "dear god I hope this is ok";
};