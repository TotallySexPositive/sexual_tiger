const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
	name          : "pout",
	aliases       : [],
	description   : "Post an image of anime pout.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Image", "Pictures"],
	execute(client, message, args) {
		let end = global.metrics.summaries.labels("pout").startTimer();
		UTIL.postRandomImageByTag(message, "pout");
		end();
	}
};