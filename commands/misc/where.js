exports.run = (client, message, args) => {
    let vc = message.member.voiceChannel
    if(vc === undefined) {
        message.channel.send(`${message.author.username}, we found you in THE VOID!`).catch(console.error);
    } else {
        message.channel.send(`${message.author.username}, we found you in ${vc.name}`).catch(console.error);
    }
}