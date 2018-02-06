exports.run = (client, message, args) => {
    let vc = message.member.voiceChannel
    if(vc === undefined) {
        message.channel.send("I'm not even in a channel.")
        return;
    }
    let dispatcher = vc.connection.dispatcher
    if(dispatcher === undefined) {
        message.channel.send("Nothing to resume.")
        return;
    }
    dispatcher.resume();
}

exports.help = () =>{
    return "Resume the previously playing song.";
};