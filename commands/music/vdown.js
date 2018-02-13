exports.run = (client, message, args) => {
    var server = global.servers[message.guild.id];
    let vc = message.member.voiceChannel
    if(vc === undefined) {
        message.channel.send("I'm not even in a channel.")
        return;
    }
    let dispatcher = vc.connection.dispatcher
    if(dispatcher === undefined) {
        message.channel.send("No audio is playing.  You must be hearing things.")
        return;
    }
    server.volume = server.volume/2;
    dispatcher.setVolume(server.volume);
}

exports.help = () =>{
    return "Turn the volume down.";
};