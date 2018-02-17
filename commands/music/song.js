exports.run = (client, message, args) => {
    let server = global.servers[message.guild.id];
    if(!server.current_song || server.current_song === undefined || server.current_song.name === undefined) {
        message.channel.send("Either nothing is playing or its not a playlist song.")
    } else {
        message.channel.send(`Current Song: ${server.current_song.name}`);
    }
}

exports.help = () =>{
    return "Displays the current song. And more later?";
};