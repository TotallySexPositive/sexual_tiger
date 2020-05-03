exports.run = (client, message, args) => {
   var server   = global.servers[message.guild.id];
   let vc       = message.member.voice.channel

    if (vc === null) {
        return message.channel.send("You are not in a voice channel. I'm not going to listen to you.")
    }

    if (server.connectionPromise) {
        server.connectionPromise.then(connection => {
            if(message.member.voice.channel === connection.channel) {
                connection.dispatcher.end()
            } else {
                return message.channel.send("You are in a different voice channel. I'm not going to listen to you.")
            }
        })
    }; 
};

exports.help = () =>{
    return "Skip a song. Why did you even queue it up you bastard?";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: "",
        full_command: "skip",
        command: "skip",
        description: "Skip to the next song in the queue.",
        syntax: "skip",
        examples: [
            {
                description: "Skip the current song.",
                code: "skip"
            }
        ]
    }
    return docs;
};