module.exports = {
	name          : "presence",
	aliases       : [],
	description   : "Make the bot stay in the channel after it is done playing a clip.  Presence command acts as a toggle.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Music", "General"],
	execute(client, message, args) {
		let end                  = global.metrics.summaries.labels("presence").startTimer();
		let server               = global.servers[message.guild.id];
		let m                    = "";
		server.maintain_presence = !server.maintain_presence;

		if (server.maintain_presence) {
			m = "Ok, I'll hang out for a bit.";
		} else {
			m = "Dont worry, I'll fucking drop you like a shit covered potato.";
		}

		message.channel.send(m);
		end();
	}
};