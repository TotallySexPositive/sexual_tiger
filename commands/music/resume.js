exports.run = (client, message, args) => {
    let vc      = message.member.voice.channel
    var server  = global.servers[message.guild.id];
    let promise = server.connectionPromise

    if(vc === null) {
        return message.channel.send("You are not in a voice channel. I'm not going to listen to you.")
    }
    if (promise === null) {
        return message.channel.send("Nothing to resume.")
    }

    promise.then(connection => {
        if(message.member.voice.channel === connection.channel) {
            connection.dispatcher.resume()
        } else {
            return message.channel.send("You are in a different voice channel. I'm not going to listen to you.")
        }
    }).catch(reason => {
        console.log(reason)
    })
}

exports.help = () =>{
    return "Resume the previously playing song.";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: "",
        full_command: "resume",
        command: "resume",
        description: "Resumes playing a previously paused song where it left off.",
        syntax: "resume",
        examples: [
            {
                description: "Resume the currently paused song.",
                code: "resume"
            }
        ]
    }
    return docs;
};