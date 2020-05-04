exports.run = (client, message, args) => {
    var server  = global.servers[message.guild.id];
    let vc      = message.member.voice.channel

    if (vc === null) {
        return message.channel.send("You are not in a voice channel. I'm not going to listen to you.")
    }

    if (server.connectionPromise != null) {
        server.song_queue.length = 0
        server.connectionPromise.then(connection => {
            if (connection.dispatcher === undefined) {
                message.channel.send("No audio is playing.  You must be hearing things.")
            } else {
                if(message.member.voice.channel === connection.channel) {
                    connection.dispatcher.end()
                } else {
                    return message.channel.send("You are in a different voice channel. I'm not going to listen to you.")
                }
            }
        })
    }
}

exports.help = () =>{
    return "Stop the current song. No way to rejoin the queue though. Fuk u";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: "",
        full_command: "stop",
        command: "stop",
        description: "Stops any playing audio and empties the queue.",
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