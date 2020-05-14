module.exports = {
	name          : "skip",
	aliases       : [],
	description   : "Skip to the next song in the queue.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Music", "General"],
	execute(message, args) {
		let end    = global.metrics.summaries.labels("skip").startTimer();
		let server = global.servers[message.guild.id];
		let vc     = message.member.voice.channel;

		if (vc === null) {
			return message.channel.send("You are not in a voice channel. I'm not going to listen to you.");
		}

		if (server.connectionPromise) {
			server.connectionPromise.then(connection => {
				if (message.member.voice.channel === connection.channel) {
					if (server.repeat) {
						server.song_queue.shift();
					}
					connection.dispatcher.end();
				} else {
					return message.channel.send("You are in a different voice channel. I'm not going to listen to you.");
				}
			});
		}
		end();
	}
};