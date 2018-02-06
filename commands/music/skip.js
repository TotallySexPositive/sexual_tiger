const path = require("path")

exports.run = (client, message, args) => {
   var server = global.servers[message.guild.id];
   if(server.dispatcher) server.dispatcher.end(); 
};

exports.help = () =>{
    return "Skip a song. Why did you even queue it up you bastard?";
};