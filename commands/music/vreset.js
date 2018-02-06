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
    
    dispatcher.setVolume(.125);
}

exports.help = () =>{
    return "Resets the volume to the default setting.";
};