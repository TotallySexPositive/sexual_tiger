const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
	name          : "cheer",
	aliases       : [],
	description   : "Post an image of anime cheer.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Image", "Pictures"],
	execute(message, args) {
		let end = global.metrics.summaries.labels("cheer").startTimer();
		UTIL.postRandomImageByTag(message, "cheer");
		end();
	}
};