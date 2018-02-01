exports.run = (client, message, args) => {
    let dispatcher = message.member.voiceChannel.connection.dispatcher
    dispatcher.setVolume(.125);
}