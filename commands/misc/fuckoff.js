const path = require("path");

module.exports = {
	name          : "fuckoff",
	aliases       : [],
	description   : "Removes the bot from the voice channel at all costs",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Misc", "General"],
	execute(client, message, args) {
		let end    = global.metrics.summaries.labels("fuckoff").startTimer();
		let server = global.servers[message.guild.id];

		if (server.connectionPromise != null) {
			server.song_queue.length = 0;

			server.connectionPromise.then(connection => {
				if (connection.dispatcher === undefined) {
					message.channel.send("No, You Fuck Off!");
				} else {
					message.channel.send(":cry:");
					connection.disconnect();
				}
			});
		} else {
			message.channel.send("No, You Fuck Off!");
		}

		end();
	}
};