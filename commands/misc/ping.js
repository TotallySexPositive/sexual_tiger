exports.run = (client, message, args) => {
    message.channel.send("pong!").catch(console.error);
}
exports.help = () =>{
    return "Will pong you so hard.";
};