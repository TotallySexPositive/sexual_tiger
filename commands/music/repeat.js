module.exports = {
	name          : "repeat",
	aliases       : [],
	description   : "Toggles whether or not clips and songs will repeat",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Music", "General"],
	execute(client, message, args) {
		let end       = global.metrics.summaries.labels("repeat").startTimer();
		let server    = global.servers[message.guild.id];
		let m         = "";
		server.repeat = !server.repeat;

		if (server.repeat) {
			m = "Sounds will repeat";
		} else {
			m = "Sounds will not repeat";
		}

		message.channel.send(m);
		end();
	}
};