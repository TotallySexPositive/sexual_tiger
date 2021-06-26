import { Client, Message } from "discord.js";
import fs from "fs";
import path from "path";
import { Command } from "../../types/Command";

class Tag extends Command {
	constructor(obj: any) {
		super(obj);
	}

	async execute(client: Client, message: Message, args: Array<string>): Promise<void> {
		if (args.length != 2) {
			message.channel.send("Incorrect usage, Check the manual.");
			return;
		}

		const p = path.resolve("built", "commands", "fun", "tag", `${args[0]}.js`);
		if (fs.existsSync(p)) {
			const commandFile = await import(p);
			//Throw away "create"
			args.shift();
			commandFile.default.execute(client, message, args);
		} else {
			message.channel.send("That isnt a valid tag command.");
		}
	}
}

const tag: Command = new Tag({
	name: "tag",
	aliases: [],
	description: "This command has no direct usage.",
	defaultAccess: 1,
	parent: "",
	syntax: "tag",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "N/A",
			code: `N/A`,
		},
	],
});

export default tag;
