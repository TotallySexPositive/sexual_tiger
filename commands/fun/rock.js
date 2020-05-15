const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
	name          : "rock",
	aliases       : [],
	description   : "Post an image of anime rock.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Image", "Pictures"],
	execute(client, message, args) {
		let end = global.metrics.summaries.labels("rock").startTimer();
		UTIL.postRandomImageByTag(message, "rock");
		end();
	}
};