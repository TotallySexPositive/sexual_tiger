exports.run = (client, message, args) => {
    var server = global.servers[message.guild.id];
    let vc = message.member.voiceChannel
    if(vc === undefined) {
        message.channel.send("I'm not even in a channel.")
        return;
    }
    
    server.songs = [];
    server.current_song_index = -1;
    server.current_song = {};
    server.repeat = false;
    
    message.guild.voiceConnection.disconnect();
    /*let dispatcher = vc.connection.dispatcher
    if(dispatcher === undefined) {
        message.channel.send("No audio is playing.  You must be hearing things.")
        return;
    }
    dispatcher.end();*/
}

exports.help = () =>{
    return "Stop the current song. No way to rejoin the queue though. Fuk u";
};