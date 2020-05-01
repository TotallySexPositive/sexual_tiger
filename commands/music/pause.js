exports.run = (client, message, args) => {
    let vc = message.member.voiceChannel
    if(vc === undefined) {
        message.channel.send("I'm not even in a channel.")
        return;
    }
    let dispatcher = vc.connection.dispatcher
    if(dispatcher === undefined) {
        message.channel.send("No audio is playing.  You must be hearing things.")
        return;
    }
    dispatcher.pause();
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