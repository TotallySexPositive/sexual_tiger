exports.run = (client, message, args) => {
    let vc = message.member.voiceChannel
    if(!vc || !vc.connection) {
        message.channel.send("I'm not even in a channel.")
        return;
    }
    let dispatcher = vc.connection.dispatcher
    if(!dispatcher || !dispatcher.paused) {
        message.channel.send("Nothing to resume.")
        return;
    }
    dispatcher.resume();
}

exports.help = () =>{
    return "Resume the previously playing song.";
};