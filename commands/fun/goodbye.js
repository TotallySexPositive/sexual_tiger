const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
	name          : "goodbye",
	aliases       : [],
	description   : "Post an image of anime goodbye.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Image", "Pictures"],
	execute(client, message, args) {
		let end = global.metrics.summaries.labels("goodbye").startTimer();
		UTIL.postRandomImageByTag(message, "goodbye");
		end();
	}
};