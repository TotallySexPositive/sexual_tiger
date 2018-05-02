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
    
    //message.guild.voiceConnection.disconnect();
    if(server.dispatcher === undefined) {
        message.channel.send("No audio is playing.  You must be hearing things.")
        return;
    }
    server.dispatcher.end();
}

exports.help = () =>{
    return "Stop the current song. No way to rejoin the queue though. Fuk u";
};

exports.docs = () => {
    let docs = {
        tab: "music",
        link: "general",
        parent: "",
        full_command: "stop",
        command: "stop",
        description: "Stops any playing audio.  If a playlist is playing it also emptys the queue.  The bot will leave when stopped, even when presence is active.",
        syntax: "stop",
        examples: [
            {
                description: "Stop the current audio.",
                code: "stop"
            }
        ]
    }
    return docs;
};