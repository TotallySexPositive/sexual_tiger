const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
	name          : "slap",
	aliases       : [],
	description   : "Post an image of anime slap.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Image", "Pictures"],
	execute(client, message, args) {
		let end = global.metrics.summaries.labels("slap").startTimer();
		UTIL.postRandomImageByTag(message, "slap");
		end();
	}
};