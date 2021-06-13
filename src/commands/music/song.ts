import { Client, Message, MessageEmbed } from "discord.js";
import fs from "fs";
import path from "path";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import { Command } from "../../types/Command";
declare const global: CustomNodeJsGlobal;

class Song extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(client: Client, message: Message, args: Array<string>): void {
		let server = global.servers[message.guild.id];
		let current_song = server.current_song;
		if (args.length == 0) {
			if (!current_song || current_song === undefined || current_song.name === undefined) {
				message.channel.send("Either nothing is playing or its not a playlist song.");
			} else {
				let embed = new MessageEmbed()
					.setTitle("Currently Playing...")
					.setColor(Math.floor(Math.random() * 16777215).toString(16))
					.addField("Song:", current_song.name, true)
					.addField("Id:", current_song.song_id, true)
					.addField("Plays:", current_song.num_plays, true);
				message.channel.send(embed);
			}
		} else {
			const song_command = args[0];
			const tail = args.slice(1);

			let p = path.resolve("built", "commands", "music", "song", `${song_command}.js`);
			if (fs.existsSync(p)) {
				let commandFile = require(p);
				commandFile.run(client, message, tail);
			} else {
				message.channel.send("That isnt a valid song command.");
			}
		}
	}
}

const song: Command = new Song({
	name: "song",
	aliases: [],
	description: "Display the currently playing songs name and id.",
	defaultAccess: 1,
	parent: "",
	syntax: "song",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Display info on current song.",
			code: "song",
		},
	],
});

export default song;
