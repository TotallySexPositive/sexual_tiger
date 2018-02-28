const path = require("path")
const DAL = require(path.resolve("dal.js"))
const UTIL = require(path.resolve("utils.js"))
const parser = require('yargs-parser')

exports.run = (client, message, args) => {
    console.log(global.img_resp_to_tag)
    console.log(global.img_resp_to_tag_order)
};
exports.help = () =>{
    return "Who?";
};

//$what am i -f doing -d one two --words= "one two three"