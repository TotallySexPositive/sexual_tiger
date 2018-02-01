exports.run = (client, message, args) => {
    let dispatcher = message.member.voiceChannel.connection.dispatcher
    let current_volume = dispatcher.volume;
    dispatcher.setVolume(current_volume/2);
}
