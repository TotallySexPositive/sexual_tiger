const path = require("path")
const DAL = require(path.resolve("dal.js"))
const UTIL = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    
    var head = args[0];
    var terms = args.slice(1).join(" ");

    switch(head) {
        case "test":
            UTIL.print(terms)
            break;
        default:
            message.channel.send("Invalid thingy passed.")
    }
};
exports.help = () =>{
    return "Who?";
};