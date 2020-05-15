module.exports = {
	name          : "stop",
	aliases       : [],
	description   : "Stops any playing audio and empties the queue.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Music", "General"],
	execute(client, message, args) {
		let end    = global.metrics.summaries.labels("stop").startTimer();
		let server = global.servers[message.guild.id];
		let vc     = message.member.voice.channel;

		if (vc === null) {
			return message.channel.send("You are not in a voice channel. I'm not going to listen to you.");
		}

		if (server.connectionPromise != null) {
			server.song_queue.length = 0;
			server.connectionPromise.then(connection => {
				if (connection.dispatcher === undefined) {
					message.channel.send("No audio is playing.  You must be hearing things.");
				} else {
					if (message.member.voice.channel === connection.channel) {
						connection.dispatcher.end();
					} else {
						return message.channel.send("You are in a different voice channel. I'm not going to listen to you.");
					}
				}
			});
		}
		end();
	}
};