import { Client, Message } from "discord.js";
import fs from "fs";
import path from "path";
import { Command } from "../../types/Command";

class Playlist extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(client: Client, message: Message, args: Array<string>): void {
		var playlist_command = args[0];
		var tail = args.slice(1);

		let p = path.resolve("built", "commands", "music", "playlist", `${playlist_command}.js`);
		if (fs.existsSync(p)) {
			let commandFile = require(p);
			commandFile.run(client, message, tail);
		} else {
			message.channel.send("That isnt a valid playlist command.");
		}
	}
}

const playlist: Command = new Playlist({
	name: "playlist",
	aliases: [],
	description: "Playlist is a parent command and has no use alone.",
	defaultAccess: 1,
	parent: "",
	syntax: "playlist",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "N/A",
			code: "n/a",
		},
	],
});

export default playlist;
