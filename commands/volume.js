exports.run = (client, message, args) => {
    let dispatcher = message.member.voiceChannel.connection.dispatcher
    let current_volume = dispatcher.volume;
    message.channel.send(`Current Volume: ${current_volume*100}%`)
}