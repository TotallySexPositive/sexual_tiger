exports.run = (client, message, args) => {
    var server = global.servers[message.guild.id];
    let vc = message.member.voice.channel
    let promise = server.connectionPromise
    if(vc === undefined){
        message.channel.send("You must be in a Voice Channel to change the volume.");
        return;
    }
    server.volume = server.volume/2;
    message.channel.send(`Lowered volume: ${server.volume*100}%`)
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

exports.help = () =>{
    return "Turn the volume down.";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: "",
        full_command: "vdown",
        command: "vdown",
        description: "Turn down the volume the bot is playing at.",
        syntax: "vdown",
        examples: [
            {
                description: "Turn down the volume",
                code: "vdown"
            }
        ]
    }
    return docs;
};