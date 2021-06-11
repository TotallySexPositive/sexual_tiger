import { Client, Message } from "discord.js";
import fs from "fs";
import path from "path";
import { Command } from "../../types/Command";

class Image extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(client: Client, message: Message, args: Array<string>): void {
		var playlist_command = args[0];
		var tail = args.slice(1);

		let p = path.resolve("built", "commands", "fun", "image", `${playlist_command}.js`);
		if (fs.existsSync(p)) {
			let commandFile = require(p);
			commandFile.run(client, message, tail);
		} else {
			message.channel.send("That isnt a valid image command.");
		}
	}
}

const image: Command = new Image({
	name: "image",
	aliases: [],
	description: "This command has no direct usage.",
	defaultAccess: 1,
	parent: "",
	syntax: "image",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "N/A",
			code: `N/A`,
		},
	],
});

export default image;
