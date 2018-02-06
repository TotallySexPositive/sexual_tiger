const path = require("path")

exports.run = (client, message, args) => {
   if(message.guild.voiceConnection) {
        message.channel.send(":cry:")
        message.guild.voiceConnection.disconnect();
   }
   else {
       message.channel.send("No, you fuck off")
   }
};