module.exports = {
	name          : "vdown",
	aliases       : [],
	description   : "Turn down the volume the bot is playing at.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Music", "General"],
	execute(client, message, args) {
		let end     = global.metrics.summaries.labels("vdown").startTimer();
		let server  = global.servers[message.guild.id];
		let vc      = message.member.voice.channel;
		let promise = server.connectionPromise;

		if (vc === undefined) {
			return message.channel.send("You must be in a Voice Channel to change the volume.");
		}

		server.volume = server.volume / 2;

		if (vc && promise != null) {
			promise.then(connection => {
				connection.dispatcher.setVolume(server.volume);
				message.channel.send(`Lowered volume: ${server.volume * 100}%`);
			}).catch(reason => {
				console.log(reason);
			});
		}
		end();
	}
};