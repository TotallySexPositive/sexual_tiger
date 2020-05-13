module.exports = {
	name: 'home',
	description: 'Display link to my home!',
	execute(message, args) {
		let end = global.metrics.summaries.labels('home').startTimer()
        let server = global.servers[message.guild.id];
        message.channel.send("Come visit me at, https://tiger.wentzel.dev")
        end()
	},
};

exports.help = () =>{
    return "Display link to my home";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
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