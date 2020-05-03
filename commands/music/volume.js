exports.run = (client, message, args) => {
    let vc = message.member.voice.channel
    console.log(vc)
    if(vc === undefined || vc == null) {
        message.channel.send("I'm not even in a channel.")
        return;
    }
    let dispatcher = vc.connection.dispatcher
    if(dispatcher === undefined) {
        message.channel.send("No audio is playing.  You must be hearing things.")
        return;
    }
    let current_volume = dispatcher.volume;
    message.channel.send(`Current Volume: ${current_volume*100}%`)
}

exports.help = () =>{
    return "Displays the current volume. Not like you couldn't tell though.";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: "",
        full_command: "volume",
        command: "volume",
        description: "Display the current volume the bot is set to.",
        syntax: "volume",
        examples: [
            {
                description: "Display current volume",
                code: "volume"
            }
        ]
    }
    return docs;
};