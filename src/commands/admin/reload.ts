import { Client, Message } from "discord.js";
import dir from "node-dir";
import path from "path";
import { Command } from "../../types/Command";

class Reload extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		if (!args || args.length < 1 || args.length == undefined) {
			message.reply("Must provide a command name to reload.");
			return;
		}
		// the path is relative to the *current folder*, so just ./filename.js
		let arg = args[0];
		if (arg === "all") {
			//reload all modules
			dir.files(path.resolve("commands"), (err, files) => {
				if (err) console.error(err);
				files.forEach((filename) => {
					if (!filename.endsWith(".js")) return;
					console.log(filename);
					delete require.cache[filename];
				});
			});
			message.reply(`Reloaded all commands.`);
		} else {
			dir.files(path.resolve("commands"), (err, files) => {
				if (err) console.error(err);
				files.some((filename) => {
					if (filename.endsWith(".js")) {
						if (filename === arg) {
							console.log("Exact match, reloading " + filename + ".");
							delete require.cache[filename];
							return true;
						} else if (filename.includes(arg)) {
							console.log("Not exact match, reloading " + filename + " just to be sure.");
							delete require.cache[filename];
							return false;
						}
					} else return false;
				});
			});
			message.reply(`Reloaded ${arg}.`);
		}
	}
}

const reload: Command = new Reload({
	name: "reload",
	aliases: [],
	description: "Refreshes a command so you can test changes.",
	defaultAccess: 0,
	parent: "",
	syntax: "reload [command]",
	category: "Admin",
	subcategory: "General",
	examples: [
		{
			description: "Refresh the gifs command.",
			code: `reload gifs`,
		},
	],
});

export default reload;
