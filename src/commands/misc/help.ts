const fs = require("fs");
const path = require("path");
const c = path.resolve("configure.json");
const cfg = require(c);
import { Client, Message, MessageEmbed } from "discord.js";
import { Command } from "../../types/Command";
import { CustomNodeJsGlobal } from "../../types/CustomNodeJsGlobal";
declare const global: CustomNodeJsGlobal;

class Help extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		if (args.length < 1) {
			const embed = new MessageEmbed();
			embed.setTitle("Command Categories");
			embed.setColor(16312092);
			embed.setTimestamp();
			global.commandTypes.forEach((i) => {
				embed.addField(i, global.commandTypeDesc[i]);
			});

			message.channel.send({ embed });
		} else {
			if (global.commandTypes.includes(args[0])) {
				let excess_commands = 0;
				const t = args[0];
				const embed = new MessageEmbed();
				embed.setTitle(`${t} Commands`);
				embed.setColor(global.commandTypeColor[t]);
				embed.setTimestamp();
				const p = path.resolve("built", "commands", t);
				fs.readdir(p, (err, items) => {
					items.forEach((item) => {
						if (item.endsWith(".js")) {
							const script = path.resolve(p, item);
							const temp = require(script);
							const k = Object.keys(temp);

							const cmd = `${cfg.prefix}${item.replace(".js", "")}`;
							let hlp = "empty";
							if (k.includes("help")) {
								hlp = `${temp.help()}`;
							}

							try {
								embed.addField(cmd, hlp);
							} catch (err) {
								excess_commands = excess_commands + 1;
							}
						}
					});

					message.channel.send({ embed }).catch((err) => {
						console.error(err.message);
						console.log(embed);
					});
					if (excess_commands > 0) {
						message.channel.send(`It looks like there were ${excess_commands} more commands we cant display here because we have too many fucking commands.  Oops?`);
					}
				});
			}
		}
	}
}

const help: Command = new Help({
	name: "help",
	aliases: [],
	description: "Displays general usage info for commands.  Not so good when looking for image commands.",
	defaultAccess: 1,
	parent: "",
	syntax: "help [category]",
	category: "Misc",
	subcategory: "General",
	examples: [
		{
			description: "Get help with admin commands",
			code: "help admin",
		},
	],
});

export default help;
