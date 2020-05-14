module.exports = {
	name          : "audio",
	aliases       : [],
	description   : "Display the link to the Gist that contains info on all the songs in the DB.",
	default_access: 0,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Music", "General"],
	execute(message, args) {
		let end    = global.metrics.summaries.labels("audio").startTimer();
		message.channel.send("You lazy sack of feces, here...\n<https://gist.github.com/narayanjr/c76103763a2f785162d30c841094e795>");
		end();
	}
};