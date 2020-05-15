let fs               = require("fs");
let path             = require("path");
let cfg              = require(path.resolve("configure.json"));
const {MessageEmbed} = require("discord.js");

module.exports = {
	name          : "help",
	aliases       : [],
	description   : "Displays general usage info for commands.  Not so good when looking for image commands.",
	default_access: 1,
	args          : false,
	usage         : "[command name]",
	parent        : "",
	category      : ["Misc", "General"],
	execute(client, message, args) {
		let end = global.metrics.summaries.labels("help").startTimer();

		if (args.length < 1) {
			let embed = new MessageEmbed()
				.setTitle("Command Categories")
				.setColor(16312092)
				.setTimestamp();

			global.commandTypes.forEach((i) => {
				embed.addField(i, global.commandTypeDesc[i]);
			});

			message.channel.send({embed});
		} else {
			if (global.commandTypes.includes(args[0])) {
				let excess_commands = 0;
				let t               = args[0];
				let p               = path.resolve("commands", t);

				let embed = new MessageEmbed()
					.setTitle(`${t} Commands`)
					.setColor(global.commandTypeColor[t])
					.setTimestamp();

				fs.readdir(p, (err, items) => {
					items.forEach((item) => {
						if (item.endsWith(".js")) {
							let script = path.resolve("commands", t, item);
							let temp   = require(script);
							let k      = Object.keys(temp);
							let cmd    = `${cfg.prefix}${item.replace(".js", "")}`;
							let hlp;

							if (k.includes("help")) {
								hlp = `${temp.help()}`;
							} else {
								hlp = "empty";
							}

							try {
								embed.addField(cmd, hlp);
							} catch (err) {
								excess_commands = excess_commands + 1;
							}
						}
					});

					message.channel.send({embed}).catch((err) => {
						console.error(err.message);
						console.log(table);
					});

					if (excess_commands > 0) {
						message.channel.send(`It looks like there were ${excess_commands} more commands we cant display here because we have too many fucking commands.  Oops?`);
					}
				});
			}
		}

		end();
	}
};