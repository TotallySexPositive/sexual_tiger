module.exports = {
	name          : "home",
	aliases       : [],
	description   : "Display link to my home!",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Misc", "General"],
	execute(client, message, args) {
		let end    = global.metrics.summaries.labels("home").startTimer();
		let server = global.servers[message.guild.id];
		message.channel.send("Come visit me at, https://tiger.wentzel.dev");
		end();
	}
};