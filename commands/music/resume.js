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
        message.channel.send("Nothing to resume.")
        return;
    }
    promise.then(
        connection=>{
            connection.dispatcher.resume()
        }
    ).catch(
        reason=>{
            console.log(reason)
        }
    )
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