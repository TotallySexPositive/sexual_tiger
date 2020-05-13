module.exports = {
	name          : "uptime",
	aliases       : [],
	description   : "Display how long the bot has been up.",
	default_access: 0,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Misc", "General"],
	execute(message, args) {
		let end  = global.metrics.summaries.labels("uptime").startTimer();
		let time = timeConversion(client.uptime);
		message.channel.send(`I've been up for ${time}!`).catch(console.error);
		global.metrics.uptime.set(client.uptime);
		end();
	}
};

function timeConversion(millisec) {
	let secs    = (millisec / 1000).toFixed(0);
	let days    = (Math.floor(secs / 86400)).toFixed(0);
	let hours   = (Math.floor(secs / 3600) % 24).toFixed(0);
	let minutes = (Math.floor(secs / 60) % 60).toFixed(0);
	let seconds = (secs % 60).toFixed(0);
	seconds     = seconds.padStart(2, "0");
	minutes     = minutes.padStart(2, "0");
	hours       = hours.padStart(2, "0");
	days        = days.padStart(2, "0");

	return `${days} days ${hours}:${minutes}:${seconds}`;
}
