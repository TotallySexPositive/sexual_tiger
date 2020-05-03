exports.run = (client, message, args) => {
    let vc = message.member.voice.channel
    var server = global.servers[message.guild.id];
    let promise = server.connectionPromise
    if(vc === undefined) {
        message.channel.send("I'm not even in a channel.")
        return;
    }
    if (promise === null)
    {
        message.channel.send("No audio is playing.  You must be hearing things.")
        return;
    }
    promise.then(
        connection=>{
            connection.dispatcher.pause()
        }
    ).catch(
        reason=>{
            console.log(reason)
        }
    )
    
}

exports.help = () =>{
    return "Pause the currently playing song.";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: "",
        full_command: "pause",
        command: "pause",
        description: "Pauses the currently playing song.",
        syntax: "pause",
        examples: [
            {
                description: "Pause the current song.",
                code: "pause"
            }
        ]
    }
    return docs;
};