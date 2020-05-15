const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
	name          : "dance",
	aliases       : [],
	description   : "Post an image of anime dance.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Image", "Pictures"],
	execute(client, message, args) {
		let end = global.metrics.summaries.labels("dance").startTimer();
		UTIL.postRandomImageByTag(message, "dance");
		end();
	}
};