exports.run = (client, message, args) => {
    var server = global.servers[message.guild.id];
    let vc = message.member.voiceChannel
    if(vc === undefined){
        message.channel.send("You must be in a Voice Channel to change the volume.");
        return;
    }
    server.volume = server.volume/2;
    if(vc && vc.connection && vc.connection.dispatcher !== undefined) {
        vc.connection.dispatcher.setVolume(server.volume);
    }

    message.channel.send(`Lowered volume: ${server.volume}`);
}

exports.help = () =>{
    return "Turn the volume down.";
};