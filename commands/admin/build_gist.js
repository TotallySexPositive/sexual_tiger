const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
	name          : "build_gist",
	aliases       : [],
	description   : "Rebuilds the Audio Gist on github from the current DB.",
	default_access: 0,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Admin", "General"],
	execute(message, args) {
		let end = global.metrics.summaries.labels("admin_build_gist").startTimer();
		let err = UTIL.rebuildAudioGist();

		if (err) {
			message.channel.send(err.message);
		} else {
			message.channel.send("Updated!");
		}

		end();
	}
};