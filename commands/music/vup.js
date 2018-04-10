exports.run = (client, message, args) => {
    var server  = global.servers[message.guild.id];
    var server = global.servers[message.guild.id];
    let vc = message.member.voiceChannel
    if(vc === undefined){
        message.channel.send("You must be in a Voice Channel to change the volume.");
        return;
    }
    
    let higher_volume = server.volume*2;
    if(higher_volume > server.max_volume) {
        message.channel.send("This is plenty loud enough.")
    }
    else {
        server.volume = higher_volume;
        
        message.channel.send(`Raised volume: ${server.volume}`);

        if(vc && vc.connection && vc.connection.dispatcher !== undefined) {
            vc.connection.dispatcher.setVolume(server.volume);
        }
    }
}

exports.help = () =>{
    return "Crank dat volume! But not to high ya hear?";
};

exports.docs = () => {
    let docs = {
        tab: "music",
        link: "general",
        parent: "",
        full_command: "vup",
        command: "vup",
        description: "Turn up the volume the bot is playing at.  There is a max volume, so dont be an ass.",
        syntax: "vup",
        examples: [
            {
                description: "Turn down the volume",
                code: "vup"
            }
        ]
    }
    return docs;
};