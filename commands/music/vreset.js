exports.run = (client, message, args) => {
    var server = global.servers[message.guild.id];
    let vc = message.member.voiceChannel
    server.volume = server.default_volume
    
    if(vc && vc.connection && vc.connection.dispatcher !== undefined) {
        vc.connection.dispatcher.setVolume(server.volume);
    }
    message.channel.send(`Reset volume: ${server.volume}`);
}

exports.help = () =>{
    return "Resets the volume to the default setting.";
};

exports.docs = () => {
    let docs = {
        tab: "music",
        link: "general",
        parent: "",
        full_command: "vreset",
        command: "vreset",
        description: "Reset the bot volume to default.",
        syntax: "vreset",
        examples: [
            {
                description: "Rest volume",
                code: "vreset"
            }
        ]
    }
    return docs;
};