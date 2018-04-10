exports.run = (client, message, args) => {
    let server = global.servers[message.guild.id];
    message.channel.send("Come visit me at, http://www.sexualtiger.com , I mean, not like right now, but soon...or soonish..")
}

exports.help = () =>{
    return "Display link to my home";
};

exports.docs = () => {
    let docs = {
        tab: "Misc",
        link: "general",
        parent: "",
        full_command: "home",
        command: "home",
        description: "Displays the link to the Sexual Tiger website.",
        syntax: 'home',
        examples: [
            {
                description: "Get link",
                code: `home`
            }
        ]
    }
    return docs;
};