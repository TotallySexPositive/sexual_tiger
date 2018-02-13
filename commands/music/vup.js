exports.run = (client, message, args) => {
    var server  = global.servers[message.guild.id];
    let vc      = message.member.voiceChannel

    if(vc === undefined) {
        message.channel.send("I'm not even in a channel.")
        return;
    }
    let dispatcher = vc.connection.dispatcher
    if(dispatcher === undefined) {
        message.channel.send("No audio is playing.  You must be hearing things.")
        return;
    }

    let higher_volume = server.volume*2;
    if(higher_volume > server.max_volume) {
        message.channel.send("This is plenty loud enough.")
    }
    else {
        server.volume = higher_volume;
        dispatcher.setVolume(server.volume);
    }
}

exports.help = () =>{
    return "Crank dat volume!";
};