const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
	name          : "nosebleed",
	aliases       : [],
	description   : "Post an image of anime nosebleed.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Image", "Pictures"],
	execute(client, message, args) {
		let end = global.metrics.summaries.labels("nosebleed").startTimer();
		UTIL.postRandomImageByTag(message, "nosebleed");
		end();
	}
};