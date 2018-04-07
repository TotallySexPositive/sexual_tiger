exports.run = (client, message, args) => {
    let server = global.servers[message.guild.id];
    message.channel.send("Come visit me at, http://www.sexualtiger.com , I mean, not like right now, but soon...or soonish..")
}

exports.help = () =>{
    return "Display link to my home";
};