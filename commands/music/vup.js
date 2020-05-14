module.exports = {
	name          : "vup",
	aliases       : [],
	description   : "Turn up the volume the bot is playing at.  There is a max volume, so dont be an ass.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Music", "Volume"],
	execute(message, args) {
		let end     = global.metrics.summaries.labels("vup").startTimer();
		let server  = global.servers[message.guild.id];
		let vc      = message.member.voice.channel;
		let promise = server.connectionPromise;

		if (vc === undefined) {
			return message.channel.send("You must be in a Voice Channel to change the volume.");
		}

		let higher_volume = server.volume * 2;

		if (higher_volume > server.max_volume) {
			message.channel.send("This is plenty loud enough.");
		} else {
			server.volume = higher_volume;

			if (vc && promise != null) {
				promise.then(connection => {
					connection.dispatcher.setVolume(server.volume);
					message.channel.send(`Raised volume: ${server.volume * 100}%`);
				}).catch(reason => {
					console.log(reason);
				});
			}
		}
		end();
	}
};