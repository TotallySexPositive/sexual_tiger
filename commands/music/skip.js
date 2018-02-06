const path = require("path")

exports.run = (client, message, args) => {
   var server = global.servers[message.guild.id];
   if(server.dispatcher) server.dispatcher.end(); 
};