module.exports = {
	name          : "resume",
	aliases       : [],
	description   : "Resumes playing a previously paused song where it left off.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Music", "General"],
	execute(client, message, args) {
		let end     = global.metrics.summaries.labels("resume").startTimer();
		let vc      = message.member.voice.channel;
		let server  = global.servers[message.guild.id];
		let promise = server.connectionPromise;

		if (vc === null) {
			return message.channel.send("You are not in a voice channel. I'm not going to listen to you.");
		}
		if (promise === null) {
			return message.channel.send("Nothing to resume.");
		}

		promise.then(connection => {
			if (message.member.voice.channel === connection.channel) {
				connection.dispatcher.resume();
			} else {
				return message.channel.send("You are in a different voice channel. I'm not going to listen to you.");
			}
		}).catch(reason => {
			console.log(reason);
		});
		end();
	}
};