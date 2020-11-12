exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('repeat').startTimer()
    let server = global.servers[message.guild.id];
    server.repeat = !server.repeat;
    let m = ""

    if (server.repeat){
        m = "Sounds will repeat";
    } else{
        m = "Sounds will not repeat";
    }

    message.channel.send(m)
    end()
};

exports.help = () =>{
    return "Toggles whether or not clips and songs will repeat";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: "",
        full_command: "repeat",
        command: "repeat",
        description: "Repeats the current song/playlist when the song/playlist ends.",
        syntax: "repeat",
        examples: [
            {
                description: "Repeat the current song.",
                code: "repeat"
            }
        ]
    }
    return docs;
};