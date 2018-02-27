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

    console.log(member.roles)
    let roles = member.roles;

    roles.forEach(r => {
        console.log(`ID: ${r.id}\nName:${r.name}\nisAdmin: ${r.hasPermission('ADMINISTRATOR')}`)
    })
   message.channel.send(description);
}

exports.help = () =>{
    return "I don't know. Who are you people?!";
};