exports.run = (client, message, args) => {
    let server = global.servers[message.guild.id];
    message.channel.send("For all your table top needs...\n<https://calendar.google.com/calendar/embed?src=vicctorydnd%40gmail.com&ctz=America%2FNew_York>")
}

exports.help = () =>{
    return "Sends the link to teh Tabel Top Calendar...";
};

exports.docs = () => {
    let docs = {
        tab: "Misc",
        link: "general",
        parent: "",
        full_command: "tabletop",
        command: "tabletop",
        description: "Display link for Table Top games calendar",
        syntax: 'tabletop',
        examples: [
            {
                description: "Get calendar link",
                code: `tabletop`
            }
        ]
    }
    return docs;
};