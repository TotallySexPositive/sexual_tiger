exports.run = (client, message, args) => {
    let author = message.author;
    let member = message.member;
    let roles = member.roles;

    console.log(roles);

  let description = `
   User id: ${author.id}
   Username: ${author.username}
   Nickname: ${member.nickname}
   Display Name: ${member.displayName}
   Discriminator: ${author.discriminator}
   `.replace(/\n +/g, `\n`);

   message.channel.send(description);
}