exports.run = (client, message, args) => {
    let server = global.servers[message.guild.id];
    message.channel.send("You lazy sack of feces, here...\n<https://gist.github.com/narayanjr/c76103763a2f785162d30c841094e795>")
}

exports.help = () =>{
    return "Sends the link to all the audio....";
};