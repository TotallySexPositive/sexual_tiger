const path = require("path");
const fs   = require("fs");

module.exports = {
	name          : "tag",
	aliases       : [],
	description   : "This command is an intermediate command and has no direct usage.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Image", "Pictures"],
	execute(message, args) {
		let end         = global.metrics.summaries.labels("tag").startTimer();
		let tag_command = args[0];
		let tail        = args.slice(1);
		let p           = path.resolve("commands", "fun", "tag", `${tag_command}.js`);

		if (fs.existsSync(p)) {
			let commandFile = require(p);
			commandFile.run(client, message, tail);
		} else {
			message.channel.send("That isnt a valid tag command.");
		}
		end();
	}
};