const path = require("path")
const DAL = require(path.resolve("dal.js"))

exports.run = (client, message, args) => {
    message.channel.send("501 Not Implemented");
};

exports.help = () =>{
    return "417 I'm a teapot";
};
