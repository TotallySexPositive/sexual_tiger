exports.run = (client, message, args) => {
    var server = global.servers[message.guild.id];
    let vc = message.member.voice.channel
    let promise = server.connectionPromise
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
        message.channel.send(`Increased volume: ${server.volume*100}%`)
        if(vc && promise != null) {
            promise.then(
                connection=>{
                    connection.dispatcher.setVolume(server.volume)
                    
                }
            ).catch(
                reason=>console.log(reason)
            );
        }
    }
}

exports.help = () =>{
    return "Crank dat volume! But not to high ya hear?";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
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