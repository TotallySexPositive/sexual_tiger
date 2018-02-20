exports.run = (client, message, args) => {
    let author = message.author;
    let member = message.member;

    let description = `
    User id: ${author.id}
    Username: ${author.username}
    Nickname: ${member.nickname}
    Display Name: ${member.displayName}
    Discriminator: ${author.discriminator}
    On Server: ${message.guild.id}
    `.replace(/\n +/g, `\n`);

   message.channel.send(description);
}

exports.help = () =>{
    return "I don't know. Who are you people?!";
};