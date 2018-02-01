exports.run = (client, message, args) => {
    let dispatcher = message.member.voiceChannel.connection.dispatcher
    let current_volume = dispatcher.volume;
    if(current_volume >= .5) {
        message.channel.send("This is plenty loud enough.")
    }
    else{
        dispatcher.setVolume(current_volume*2);
    }
}