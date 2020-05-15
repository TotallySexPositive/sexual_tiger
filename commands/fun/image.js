const path = require("path");
const fs   = require("fs");

module.exports = {
	name          : "image",
	aliases       : [],
	description   : "This is just an intermediate command, it has no direct use.",
	default_access: 0,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Image", "Pictures"],
	execute(client, message, args) {
		let end              = global.metrics.summaries.labels("image").startTimer();
		let playlist_command = args[0];
		let tail             = args.slice(1);
		let p                = path.resolve("commands", "fun", "image", `${playlist_command}.js`);

		if (fs.existsSync(p)) {
			let commandFile = require(p);
			commandFile.run(client, message, tail);
		} else {
			message.channel.send("That isnt a valid image command.");
		}

		end();
	}
};