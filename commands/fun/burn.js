const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
	name          : "burn",
	aliases       : [],
	description   : "Post an image of anime burn.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Image", "Pictures"],
	execute(client, message, args) {
		let end = global.metrics.summaries.labels("burn").startTimer();
		UTIL.postRandomImageByTag(message, "burn");
		end();
	}
};