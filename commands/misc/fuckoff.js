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

exports.help = () =>{
    return "Will tell the bot to fuck off from your voice channel.";
};

exports.docs = () => {
    let docs = {
        tab: "Misc",
        link: "general",
        parent: "",
        full_command: "fuckoff",
        command: "fuckoff",
        description: "Removes the bot from the voice channel at all costs",
        syntax: 'fuckoff',
        examples: [
            {
                description: "Force the bot out of the channel",
                code: `fuckoff`
            }
        ]
    }
    return docs;
};