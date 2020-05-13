module.exports = {
	name          : "ping",
	aliases       : [],
	description   : "Pings the bot and has the bot acknowledge its alive.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Misc", "General"],
	execute(message, args) {
		let end = global.metrics.summaries.labels("ping").startTimer();
		message.channel.send("pong!").catch(console.error);
		message.channel.send(`My sexual ping is ${client.ping}`);
		end();
	}
};