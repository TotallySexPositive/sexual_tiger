exports.run = (client, message, args) => {
    let server = global.servers[message.guild.id];
    message.channel.send("You lazy sack of feces, here...\n<https://gist.github.com/narayanjr/c76103763a2f785162d30c841094e795>")
}

exports.help = () =>{
    return "Sends the link to all the audio....";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: "",
        full_command: "audio",
        command: "audio",
        description: "Display the link to the Gist that contains info on all the songs in the DB.",
        syntax: "audio",
        examples: [
            {
                description: "Display link to list of songs.",
                code: "audio"
            }
        ]
    }
    return docs;
};