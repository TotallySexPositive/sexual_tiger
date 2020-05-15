const path = require("path");
const fs   = require("fs");

module.exports = {
	name          : "playlist",
	aliases       : [],
	description   : "Playlist is a parent command and has no use alone.",
	default_access: 1,
	args          : true,
	usage         : "",
	parent        : "",
	category      : ["Music", "General"],
	execute(client, message, args) {
		let end              = global.metrics.summaries.labels("playlist").startTimer();
		let playlist_command = args[0];
		let tail             = args.slice(1);

		let p = path.resolve("commands", "music", "playlist", `${playlist_command}.js`);

		if (fs.existsSync(p)) {
			let commandFile = require(p);
			commandFile.run(client, message, tail);
		} else {
			message.channel.send("That isnt a valid playlist command.");
		}
		end();
	}
};