exports.run =  (client, message, args)=>{
	let server = global.servers[message.guild.id];
    server.maintain_presence = !server.maintain_presence;
    let m = ""
    if (server.maintain_presence){
    	m = "Ok, I'll hang out for a bit.";	
    } else{
    	m = "Dont worry, I'll fucking drop you like a shit covered potato.";
    }

    message.channel.send(m)
	//Could make it leave here if you want
}

exports.help = ()=>{
	return "Toggles whether or not the bot should stay in voice channel or not."
}

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: "",
        full_command: "presence",
        command: "presence",
        description: "Make the bot stay in the channel after it is done playing a clip.  Presence command acts as a toggle..",
        syntax: "presence",
        examples: [
            {
                description: "Keep bot in the channel after song ends.",
                code: "presence"
            }
        ]
    }
    return docs;
};