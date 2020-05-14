module.exports = {
	name          : "pause",
	aliases       : [],
	description   : "Pauses the currently playing song.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Music", "General"],
	execute(message, args) {
		let end     = global.metrics.summaries.labels("pause").startTimer();
		let vc      = message.member.voice.channel;
		let server  = global.servers[message.guild.id];
		let promise = server.connectionPromise;

		if (vc === null) {
			return message.channel.send("You are not in a voice channel. I'm not going to listen to you.");
		}
		if (promise === null) {
			return message.channel.send("No audio is playing.  You must be hearing things.");
		}

		promise.then(connection => {
			if (message.member.voice.channel === connection.channel) {
				connection.dispatcher.pause();
			} else {
				return message.channel.send("You are in a different voice channel. I'm not going to listen to you.");
			}
		}).catch(reason => {
			console.log(reason);
		});
		end();
	}
};