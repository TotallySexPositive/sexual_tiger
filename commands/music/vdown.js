exports.run = (client, message, args) => {
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
    let current_volume = dispatcher.volume;
    dispatcher.setVolume(current_volume/2);
}

exports.help = () =>{
    return "Turn the volume down.";
};