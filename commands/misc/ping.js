exports.run = (client, message, args) => {
    message.channel.send("pong!").catch(console.error);
    message.channel.send(`My sexual ping is ${client.ping}`)
}
exports.help = () =>{
    return "Will pong you so hard.";
};