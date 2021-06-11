import { Client, Message } from "discord.js";
import fs from "fs";
import path from "path";
import { Command } from "../../types/Command";

class Tag extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(client: Client, message: Message, args: Array<string>): void {
		//if(args.length < 2) return message.channel.send("Incorrect usage, Check the help file.")
		var playlist_command = args[0];
		var tail = args.slice(1);

		let p = path.resolve("built", "commands", "fun", "tag", `${playlist_command}.js`);
		if (fs.existsSync(p)) {
			let commandFile = require(p);
			commandFile.run(client, message, tail);
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
