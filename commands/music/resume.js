exports.run = (client, message, args) => {
    let vc = message.member.voice.channel
    if(!vc || !vc.connection) {
        message.channel.send("I'm not even in a channel.")
        return;
    }
    let dispatcher = vc.connection.dispatcher
    if(!dispatcher || !dispatcher.paused) {
        message.channel.send("Nothing to resume.")
        return;
    }
    dispatcher.resume();
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