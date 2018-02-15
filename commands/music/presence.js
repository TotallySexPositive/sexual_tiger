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