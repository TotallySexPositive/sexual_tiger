exports.run = (client, message, args) => {
    message.channel.send("You lazy sack of feces, here...\n<https://tiger.wentzel.dev/audio.html>")
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
        description: "Display the link to the audio list on the site.",
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