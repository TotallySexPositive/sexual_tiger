exports.run =  (client, message, args)=>{
	let server = global.servers[message.guild.id]
	let p = server.maintain_presence
	console.log(p)
	let not_p = !server.maintain_presence
	console.log(not_p)
	server.maintain_presence = not_p
	//Could make it leave here if you want
}

exports.help = ()=>{
	return "Toggles whether or not the bot should stay in voice channel or not."
}