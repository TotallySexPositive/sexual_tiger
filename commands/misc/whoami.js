const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
	name          : "whoami",
	aliases       : [],
	description   : "Tells you a little about yourself",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Misc", "General"],
	execute(client, message, args) {
		let end    = global.metrics.summaries.labels("whoami").startTimer();
		let author = message.author;
		let member = message.member;

		let is_admin = UTIL.isAdmin(member);

		let description = `
			User id: ${author.id}
			Username: ${author.username}
			Nickname: ${member.nickname}
			Display Name: ${member.displayName}
			Discriminator: ${author.discriminator}
			On Server: ${message.guild.id}
			isAdmin: ${is_admin}
    	`.replace(/\n +/g, `\n`);

		message.channel.send(description);
		end();
	}
};