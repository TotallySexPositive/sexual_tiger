const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "cheer");	
}

exports.help = () =>{
    return "Give me an A!";
};